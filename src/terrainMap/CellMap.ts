namespace Nabu {

    export class CellMap {
        public data: Uint8ClampedArray;
        public min: number = 0;
        public max: number = 0;
        public lastUsageTime: number;

        constructor(private _cellMapGenerator: CellMapGenerator, public iMap: number, public jMap: number) {
            this.lastUsageTime = performance.now();
        }

        public get(i: number, j: number) {
            return this.data[i + j * CellMapGenerator.MAP_SIZE];
        }
    }

    export class BiomeWeight {

        public v1: number;
        public w1: number;
        public v2: number;
        public w2: number;
        public v3: number;
        public w3: number;

        constructor(valueA: number, weightA: number, valueB?: number, weightB?: number, valueC?: number, weightC?: number) {
            if (weightC) {
                if (weightA >= weightB && weightA >= weightC) {
                    this.v1 = valueA;
                    this.w1 = weightA;
                    if (weightB >= weightC) {
                        this.v2 = valueB;
                        this.w2 = weightB;
                        this.v3 = valueC;
                        this.w3 = weightC;
                    }
                    else {
                        this.v2 = valueC;
                        this.w2 = weightC;
                        this.v3 = valueB;
                        this.w3 = weightB;
                    }
                }
                else if (weightB >= weightA && weightB >= weightC) {
                    this.v1 = valueB;
                    this.w1 = weightB;
                    if (weightA >= weightC) {
                        this.v2 = valueA;
                        this.w2 = weightA;
                        this.v3 = valueC;
                        this.w3 = weightC;
                    }
                    else {
                        this.v2 = valueC;
                        this.w2 = weightC;
                        this.v3 = valueA;
                        this.w3 = weightA;
                    }
                }
                else if (weightC >= weightA && weightC >= weightB) {
                    this.v1 = valueC;
                    this.w1 = weightC;
                    if (weightA >= weightB) {
                        this.v2 = valueA;
                        this.w2 = weightA;
                        this.v3 = valueB;
                        this.w3 = weightB;
                    }
                    else {
                        this.v2 = valueB;
                        this.w2 = weightB;
                        this.v3 = valueA;
                        this.w3 = weightA;
                    }
                }

            }
            else if (weightB) {
                if (weightA >= weightB) {
                    this.v1 = valueA;
                    this.w1 = weightA;
                    this.v2 = valueB;
                    this.w2 = weightB;
                }
                else {
                    this.v1 = valueB;
                    this.w1 = weightB;
                    this.v2 = valueA;
                    this.w2 = weightA;
                }
            }
            else {
                this.v1 = valueA;
                this.w1 = weightA;
            }
        }
    }

    export class CellMapGenerator {
        public static MAP_SIZE: number = 1024;

        public voronoiDiagram: VoronoiDiagram;
        public maxFrameTimeMS: number = 15;
        public maxCachedMaps: number = 20;
        public cellMaps: CellMap[] = [];

        constructor(public seededMap: SeededMap, public cellSize: number, public pixelSize: number = 8) {
            this.voronoiDiagram = new VoronoiDiagram(cellSize, 0.5);
        }

        public getMap(IMap: number, JMap: number): CellMap {
            let map = this.cellMaps.find((map) => {
                return map.iMap === IMap && map.jMap === JMap;
            });
            if (!map) {
                map = new CellMap(this, IMap, JMap);
                this.generateMapData(map);
                this.cellMaps.push(map);
                this.updateDetailedCache();
            }
            map.lastUsageTime = performance.now();
            return map;
        }

        public getValue(iGlobal: number, jGlobal: number): number {
            let l = CellMapGenerator.MAP_SIZE * this.pixelSize;
            let map = this.getMap(Math.floor(iGlobal / l), Math.floor(jGlobal / l));
            let i = Math.floor((iGlobal % l) / this.pixelSize);
            let j = Math.floor((jGlobal % l) / this.pixelSize);
            return map.data[i + j * CellMapGenerator.MAP_SIZE];
        }

        private kernel = [{ v: 0, d: 1 }, { v: 0, d: 1 }, { v: 0, d: 1 }, { v: 0, d: 1 }];
        public getBiomeWeights(iGlobal: number, jGlobal: number): { v1: number, w1: number, v2?: number, w2?: number, v3?: number, w3?: number } {
            let di = (iGlobal % this.pixelSize) / this.pixelSize;
            let dj = (jGlobal % this.pixelSize) / this.pixelSize;
            let a = this.kernel[0].v = this.getValue(iGlobal, jGlobal);
            let b = this.kernel[1].v = this.getValue((iGlobal + this.pixelSize), jGlobal);
            let c = this.kernel[2].v = this.getValue((iGlobal + this.pixelSize), (jGlobal + this.pixelSize));
            let d = this.kernel[3].v = this.getValue(iGlobal, (jGlobal + this.pixelSize));
            if (a === b && a === c && a === d) {
                return { v1: this.kernel[0].v, w1: 1 };
            }
            
            if (a === b && c === d) {
                let w = 1 - dj;
                return new BiomeWeight(a, w, c, 1 - w);
            }
            if (a === d && b === c) {
                let w = 1 - di;
                return new BiomeWeight(a, w, b, 1 - w);
            }

            if (b === c && c === d) {
                let w = 1 - Math.sqrt(di * di + dj * dj);
                let l = Math.sqrt(w * w + (1 - w) * (1 - w));
                w /= l;
                return new BiomeWeight(a, w, b, 1 - w);
            }
            if (a === c && c === d) {
                let w = 1 - Math.sqrt((1 - di) * (1 - di) + dj * dj);
                let l = Math.sqrt(w * w + (1 - w) * (1 - w));
                w /= l;
                return new BiomeWeight(b, w, a, 1 - w);
            }
            if (a === b && b === d) {
                let w = 1 - Math.sqrt((1 - di) * (1 - di) + (1 - dj) * (1 - dj));
                let l = Math.sqrt(w * w + (1 - w) * (1 - w));
                w /= l;
                return new BiomeWeight(c, w, a, 1 - w);
            }
            if (a === b && b === c) {
                let w = 1 - Math.sqrt(di * di + (1 - dj) * (1 - dj));
                let l = Math.sqrt(w * w + (1 - w) * (1 - w));
                w /= l;
                return new BiomeWeight(d, w, a, 1 - w);
            }

            if (a === b) {
                let wA = 1 - dj;
                let wC = 1 - Math.sqrt((1 - di) * (1 - di) + (1 - dj) * (1 - dj));
                let wD = 1 - Math.sqrt(di * di + (1 - dj) * (1 - dj));
                let l = Math.sqrt(wA * wA + wC * wC + wD * wD)
                return new BiomeWeight(a, wA / l, c, wC / l, d, wD / l);
            }
            if (b === c) {
                let wB = di;
                let wA = 1 - Math.sqrt(di * di + dj * dj);
                let wD = 1 - Math.sqrt(di * di + (1 - dj) * (1 - dj));
                let l = Math.sqrt(wA * wA + wB * wB + wD * wD)
                return new BiomeWeight(b, wB / l, a, wA / l, d, wD / l);
            }
            if (c === d) {
                let wC = dj;
                let wA = 1 - Math.sqrt(di * di + dj * dj);
                let wB = 1 - Math.sqrt((1 - di) * (1 - di) + dj * dj);
                let l = Math.sqrt(wC * wC + wA * wA + wB * wB)
                return new BiomeWeight(c, wC / l, b, wB / l, a, wA / l);
            }
            if (a === d) {
                let wA = 1 - dj;
                let wB = 1 - Math.sqrt((1 - di) * (1 - di) + dj * dj);
                let wC = 1 - Math.sqrt((1 - di) * (1 - di) + (1 - dj) * (1 - dj));
                let l = Math.sqrt(wC * wC + wA * wA + wB * wB)
                return new BiomeWeight(c, wC / l, b, wB / l, a, wA / l);
            }

            return { v1: 0, w1: 1 };
        }

        public updateDetailedCache(): void {
            while (this.cellMaps.length > this.maxCachedMaps) {
                this.cellMaps = this.cellMaps.sort((a, b) => {
                    return a.lastUsageTime - b.lastUsageTime;
                });
                this.cellMaps.splice(0, 1);
            }
        }

        public generateMapData(map: CellMap): void {
            let IMap = map.iMap;
            let JMap = map.jMap;
            map.data = this.voronoiDiagram.getValues(CellMapGenerator.MAP_SIZE, IMap, JMap);
        }
    }
}
