namespace Nabu {
    export class SeededMap {
        public debugBaseSeedMap: Uint8ClampedArray;
        public seedMaps: SeedMap[][] = [];
        public primes = [1, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

        constructor(public N: number, public size: number) {}

        public static CreateFromMasterSeed(masterSeed: Uint8ClampedArray, N: number, size: number): SeededMap {
            let seededMap = new SeededMap(N, size);

            let l = N * size;
            let L = l * l;
            let baseSeedMap = new Uint8ClampedArray(L);
            let index = 0;
            let masterSeedLength = masterSeed.length;
            let start = 0;

            while (index < L) {
                for (let i = 0; i < masterSeedLength; i++) {
                    if (index < L) {
                        baseSeedMap[index] = masterSeed[(i + start) % masterSeedLength];
                    }
                    index++;
                }
                start++;
            }

            for (let counts = 0; counts < 4; counts++) {
                let clonedBaseSeedMap = new Uint8ClampedArray(baseSeedMap);
                for (let i = 0; i < l; i++) {
                    for (let j = 0; j < l; j++) {
                        let i2 = (i + 1) % l;
                        if (i % 2 === 1) {
                            i2 = (i - 1 + l) % l;
                        }
                        baseSeedMap[i + j * l] = clonedBaseSeedMap[i2 + j * l];
                    }
                }

                clonedBaseSeedMap = new Uint8ClampedArray(baseSeedMap);
                for (let i = 0; i < l; i++) {
                    for (let j = 0; j < l; j++) {
                        let j2 = (j + 1) % l;
                        if (j % 2 === 1) {
                            j2 = (j - 1 + l) % l;
                        }
                        baseSeedMap[i + j * l] = clonedBaseSeedMap[i + j2 * l];
                    }
                }

                for (let i = 1; i < L; i++) {
                    baseSeedMap[i] = baseSeedMap[i] ^ baseSeedMap[i - 1];
                }
            }

            seededMap.seedMaps = [];
            for (let i = 0; i < seededMap.N; i++) {
                seededMap.seedMaps[i] = [];
                for (let j = 0; j < seededMap.N; j++) {
                    seededMap.seedMaps[i][j] = new SeedMap("seedmap-" + i + "-" + j, seededMap.size);
                    seededMap.seedMaps[i][j].fillFromBaseSeedMap(baseSeedMap, N * size, i, j);
                }
            }

            seededMap.debugBaseSeedMap = baseSeedMap;

            /*
        let sorted = baseSeedMap.sort((a, b) => { return a - b; });
        console.log("#0 " + sorted[0]);
        for (let d = 10; d < 100; d += 10) {
            console.log("#" + d.toFixed(0) + " " + (sorted[Math.floor(d / 100 * L)] / 255 * 100).toFixed(2));
        }
        console.log("#100 " + sorted[L - 1]);
        */

            return seededMap;
        }

        public static CreateWithRandomFill(N: number, size: number): SeededMap {
            let seededMap = new SeededMap(N, size);

            seededMap.seedMaps = [];
            for (let i = 0; i < seededMap.N; i++) {
                seededMap.seedMaps[i] = [];
                for (let j = 0; j < seededMap.N; j++) {
                    seededMap.seedMaps[i][j] = new SeedMap("seedmap-" + i + "-" + j, seededMap.size);
                    seededMap.seedMaps[i][j].randomFill();
                }
            }

            return seededMap;
        }

        public getValue(i: number, j: number, d: number): number {
            i = Math.max(i, 0);
            j = Math.max(j, 0);
            let di = this.primes[(Math.floor(i / (this.size * this.N)) + d) % this.primes.length];
            let dj = this.primes[(Math.floor(j / (this.size * this.N)) + d) % this.primes.length];
            if (!isFinite(di)) {
                di = 1;
            }
            if (!isFinite(dj)) {
                dj = 1;
            }
            let IMap = (i + Math.floor(i / this.size)) % this.N;
            let JMap = (j + Math.floor(j / this.size)) % this.N;
            return this.seedMaps[IMap][JMap].getData(i * di, j * dj);
        }

        public downloadAsPNG(size: number, d: number = 0): void {
            let canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;

            let data = new Uint8ClampedArray(size * size);
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    data[i + j * size] = this.getValue(i, j, d);
                }
            }

            let context = canvas.getContext("2d");
            let pixels = new Uint8ClampedArray(data.length * 4);
            for (let i = 0; i < data.length; i++) {
                let v = Math.floor(data[i] / 32) * 32;
                pixels[4 * i] = v;
                pixels[4 * i + 1] = v;
                pixels[4 * i + 2] = v;
                pixels[4 * i + 3] = 255;
            }
            context.putImageData(new ImageData(pixels, size, size), 0, 0);

            var a = document.createElement("a");
            a.setAttribute("href", canvas.toDataURL());
            a.setAttribute("download", "genMap.png");

            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        public downloadDebugBaseSeedAsPNG(): void {
            let size = this.N * this.size;
            let canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;

            let context = canvas.getContext("2d");
            let pixels = new Uint8ClampedArray(this.debugBaseSeedMap.length * 4);
            for (let i = 0; i < this.debugBaseSeedMap.length; i++) {
                let v = Math.floor(this.debugBaseSeedMap[i] / 32) * 32;
                pixels[4 * i] = v;
                pixels[4 * i + 1] = v;
                pixels[4 * i + 2] = v;
                pixels[4 * i + 3] = 255;
            }
            context.putImageData(new ImageData(pixels, size, size), 0, 0);

            var a = document.createElement("a");
            a.setAttribute("href", canvas.toDataURL());
            a.setAttribute("download", "genMap.png");

            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
}
