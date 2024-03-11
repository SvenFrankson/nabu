namespace Nabu {
    export class TerrainMap {
        public data: Uint8ClampedArray;
        public lastUsageTime: number;

        constructor(private _terrainMapGenerator: TerrainMapGenerator, public iMap: number, public jMap: number) {
            this.lastUsageTime = performance.now();
        }

        public get(i: number, j: number) {
            return this.data[i + j * TerrainMapGenerator.MAP_SIZE];
        }
    }

    export class TerrainMapGenerator {
        public static MAP_SIZE: number = 1024;
        public static MEDIUM_MAP_PIXEL_SIZE: number = 8;
        public static LARGE_MAP_PIXEL_SIZE: number = 256;

        public maxFrameTimeMS: number = 15;
        public maxCachedMaps: number = 20;
        public detailedMaps: TerrainMap[] = [];
        public mediumMaps: TerrainMap[] = [];
        public largeMaps: TerrainMap[] = [];

        constructor(public seededMap: SeededMap, public period: number) {
            let floor = Nabu.Pow2(Nabu.FloorPow2Exponent(this.period));
            let ceil = Nabu.Pow2(Nabu.CeilPow2Exponent(this.period));
            if (Math.abs(floor - this.period) <= Math.abs(ceil - this.period)) {
                this.period = floor;
            } else {
                this.period = ceil;
            }
        }

        public async getMap(IMap: number, JMap: number): Promise<TerrainMap> {
            let map = this.detailedMaps.find((map) => {
                return map.iMap === IMap && map.jMap === JMap;
            });
            if (!map) {
                map = new TerrainMap(this, IMap, JMap);
                map.data = await this.generateMapData(IMap, JMap);
                this.detailedMaps.push(map);
                this.updateDetailedCache();
            }
            map.lastUsageTime = performance.now();
            return map;
        }

        public updateDetailedCache(): void {
            while (this.detailedMaps.length > this.maxCachedMaps) {
                this.detailedMaps = this.detailedMaps.sort((a, b) => {
                    return a.lastUsageTime - b.lastUsageTime;
                });
                this.detailedMaps.splice(0, 1);
            }
        }

        public async getMediumMap(IMap: number, JMap: number): Promise<TerrainMap> {
            let map = this.mediumMaps.find((map) => {
                return map.iMap === IMap && map.jMap === JMap;
            });
            if (!map) {
                map = new TerrainMap(this, IMap, JMap);
                map.data = await this.generateMapData(IMap, JMap, TerrainMapGenerator.MEDIUM_MAP_PIXEL_SIZE);
                this.mediumMaps.push(map);
                this.updateMediumedCache();
            }
            map.lastUsageTime = performance.now();
            return map;
        }

        public updateMediumedCache(): void {
            while (this.mediumMaps.length > this.maxCachedMaps) {
                this.mediumMaps = this.mediumMaps.sort((a, b) => {
                    return a.lastUsageTime - b.lastUsageTime;
                });
                this.mediumMaps.splice(0, 1);
            }
        }

        public async getLargeMap(IMap: number, JMap: number): Promise<TerrainMap> {
            let map = this.largeMaps.find((map) => {
                return map.iMap === IMap && map.jMap === JMap;
            });
            if (!map) {
                map = new TerrainMap(this, IMap, JMap);
                map.data = await this.generateMapData(IMap, JMap, TerrainMapGenerator.LARGE_MAP_PIXEL_SIZE);
                this.largeMaps.push(map);
                this.updateLargedCache();
            }
            map.lastUsageTime = performance.now();
            return map;
        }

        public updateLargedCache(): void {
            while (this.largeMaps.length > this.maxCachedMaps) {
                this.largeMaps = this.largeMaps.sort((a, b) => {
                    return a.lastUsageTime - b.lastUsageTime;
                });
                this.largeMaps.splice(0, 1);
            }
        }

        public async generateMapData(IMap: number, JMap: number, pixelSize: number = 1): Promise<Uint8ClampedArray> {
            return new Promise<Uint8ClampedArray>(async (resolve) => {
                let map = new Uint8ClampedArray(TerrainMapGenerator.MAP_SIZE * TerrainMapGenerator.MAP_SIZE);
                map.fill(0);

                // Bicubic version
                let maxDegree = 7;
                let f = 0.5;
                let l = this.period / pixelSize;
                for (let degree = 0; degree < maxDegree; degree++) {
                    if (l > TerrainMapGenerator.MAP_SIZE) {
                        let count = l / TerrainMapGenerator.MAP_SIZE;
                        let I0 = Math.floor(IMap / count);
                        let J0 = Math.floor(JMap / count);

                        let v00 = this.seededMap.getValue(I0 - 1, J0 - 1, degree);
                        let v10 = this.seededMap.getValue(I0 + 0, J0 - 1, degree);
                        let v20 = this.seededMap.getValue(I0 + 1, J0 - 1, degree);
                        let v30 = this.seededMap.getValue(I0 + 2, J0 - 1, degree);
                        let v01 = this.seededMap.getValue(I0 - 1, J0 + 0, degree);
                        let v11 = this.seededMap.getValue(I0 + 0, J0 + 0, degree);
                        let v21 = this.seededMap.getValue(I0 + 1, J0 + 0, degree);
                        let v31 = this.seededMap.getValue(I0 + 2, J0 + 0, degree);
                        let v02 = this.seededMap.getValue(I0 - 1, J0 + 1, degree);
                        let v12 = this.seededMap.getValue(I0 + 0, J0 + 1, degree);
                        let v22 = this.seededMap.getValue(I0 + 1, J0 + 1, degree);
                        let v32 = this.seededMap.getValue(I0 + 2, J0 + 1, degree);
                        let v03 = this.seededMap.getValue(I0 - 1, J0 + 2, degree);
                        let v13 = this.seededMap.getValue(I0 + 0, J0 + 2, degree);
                        let v23 = this.seededMap.getValue(I0 + 1, J0 + 2, degree);
                        let v33 = this.seededMap.getValue(I0 + 2, J0 + 2, degree);

                        let diMin = (IMap % count) / count;
                        let diMax = diMin + 1 / count;
                        let djMin = (JMap % count) / count;
                        let djMax = djMin + 1 / count;

                        let doStep = (jj: number) => {
                            for (let ii = 0; ii < TerrainMapGenerator.MAP_SIZE; ii++) {
                                let di = ii / TerrainMapGenerator.MAP_SIZE;
                                di = diMin * (1 - di) + diMax * di;
                                let dj = jj / TerrainMapGenerator.MAP_SIZE;
                                dj = djMin * (1 - dj) + djMax * dj;
                                map[ii + jj * TerrainMapGenerator.MAP_SIZE] += Nabu.BicubicInterpolate(di, dj, v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32, v03, v13, v23, v33) * f;
                            }
                        };

                        let t0 = performance.now();
                        for (let jj = 0; jj < TerrainMapGenerator.MAP_SIZE; jj++) {
                            let t1 = performance.now();
                            if (t1 - t0 < this.maxFrameTimeMS) {
                                doStep(jj);
                            } else {
                                //console.log("break 1 at " + (t1 - t0).toFixed(3) + " ms");
                                await Nabu.NextFrame();
                                t0 = performance.now();
                                doStep(jj);
                            }
                        }
                    } else if (l >= 2) {
                        let n = TerrainMapGenerator.MAP_SIZE / l;

                        let iOffset = IMap * n;
                        let jOffset = JMap * n;

                        let doStep = (j: number) => {
                            let v00 = this.seededMap.getValue(iOffset - 1, jOffset + j - 1, degree);
                            let v10 = this.seededMap.getValue(iOffset + 0, jOffset + j - 1, degree);
                            let v20 = this.seededMap.getValue(iOffset + 1, jOffset + j - 1, degree);
                            let v30 = this.seededMap.getValue(iOffset + 2, jOffset + j - 1, degree);
                            let v01 = this.seededMap.getValue(iOffset - 1, jOffset + j + 0, degree);
                            let v11 = this.seededMap.getValue(iOffset + 0, jOffset + j + 0, degree);
                            let v21 = this.seededMap.getValue(iOffset + 1, jOffset + j + 0, degree);
                            let v31 = this.seededMap.getValue(iOffset + 2, jOffset + j + 0, degree);
                            let v02 = this.seededMap.getValue(iOffset - 1, jOffset + j + 1, degree);
                            let v12 = this.seededMap.getValue(iOffset + 0, jOffset + j + 1, degree);
                            let v22 = this.seededMap.getValue(iOffset + 1, jOffset + j + 1, degree);
                            let v32 = this.seededMap.getValue(iOffset + 2, jOffset + j + 1, degree);
                            let v03 = this.seededMap.getValue(iOffset - 1, jOffset + j + 2, degree);
                            let v13 = this.seededMap.getValue(iOffset + 0, jOffset + j + 2, degree);
                            let v23 = this.seededMap.getValue(iOffset + 1, jOffset + j + 2, degree);
                            let v33 = this.seededMap.getValue(iOffset + 2, jOffset + j + 2, degree);

                            for (let i = 0; i < n; i++) {
                                for (let ii = 0; ii < l; ii++) {
                                    for (let jj = 0; jj < l; jj++) {
                                        let di = ii / l;
                                        let dj = jj / l;
                                        map[i * l + ii + (j * l + jj) * TerrainMapGenerator.MAP_SIZE] += Nabu.BicubicInterpolate(di, dj, v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32, v03, v13, v23, v33) * f;
                                    }
                                }
                                if (i < n - 1) {
                                    v00 = v10;
                                    v10 = v20;
                                    v20 = v30;
                                    v30 = this.seededMap.getValue(iOffset + i + 1 + 2, jOffset + j - 1, degree);
                                    v01 = v11;
                                    v11 = v21;
                                    v21 = v31;
                                    v31 = this.seededMap.getValue(iOffset + i + 1 + 2, jOffset + j + 0, degree);
                                    v02 = v12;
                                    v12 = v22;
                                    v22 = v32;
                                    v32 = this.seededMap.getValue(iOffset + i + 1 + 2, jOffset + j + 1, degree);
                                    v03 = v13;
                                    v13 = v23;
                                    v23 = v33;
                                    v33 = this.seededMap.getValue(iOffset + i + 1 + 2, jOffset + j + 2, degree);
                                }
                            }
                        };

                        let t0 = performance.now();
                        for (let j = 0; j < n; j++) {
                            let t1 = performance.now();
                            if (t1 - t0 < this.maxFrameTimeMS) {
                                doStep(j);
                            } else {
                                //console.log("break 2 at " + (t1 - t0).toFixed(3) + " ms");
                                await Nabu.NextFrame();
                                t0 = performance.now();
                                doStep(j);
                            }
                        }
                    }

                    l = l / 2;
                    f = f / 2;
                    await Nabu.NextFrame();
                }

                resolve(map);
            });
        }

        public async downloadAsPNG(IMap: number, JMap: number, size: number = 1, range: number = 0): Promise<void> {
            let canvas = document.createElement("canvas");
            canvas.width = TerrainMapGenerator.MAP_SIZE * size;
            canvas.height = TerrainMapGenerator.MAP_SIZE * size;
            let context = canvas.getContext("2d");

            for (let J = 0; J < size; J++) {
                for (let I = 0; I < size; I++) {
                    let map: TerrainMap;
                    if (range === 0) {
                        map = await this.getMap(IMap + I, JMap + J);
                    } else if (range === 1) {
                        map = await this.getMediumMap(IMap + I, JMap + J);
                    } else if (range === 2) {
                        map = await this.getLargeMap(IMap + I, JMap + J);
                    }
                    let pixels = new Uint8ClampedArray(map.data.length * 4);
                    for (let i = 0; i < map.data.length; i++) {
                        let v = map.data[i];
                        pixels[4 * i] = v;
                        pixels[4 * i + 1] = v;
                        pixels[4 * i + 2] = v;
                        pixels[4 * i + 3] = 255;
                    }
                    context.putImageData(new ImageData(pixels, TerrainMapGenerator.MAP_SIZE, TerrainMapGenerator.MAP_SIZE), I * TerrainMapGenerator.MAP_SIZE, J * TerrainMapGenerator.MAP_SIZE);
                }
            }

            var ranges = ["detailed", "medium", "large"];
            var a = document.createElement("a");
            a.setAttribute("href", canvas.toDataURL());
            a.setAttribute("download", "terrainMap_" + ranges[range] + "_" + IMap + "_" + JMap + ".png");

            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
}
