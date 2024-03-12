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
