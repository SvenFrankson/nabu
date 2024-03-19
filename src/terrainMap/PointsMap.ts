namespace Nabu {

    export class Point {

        public iGlobal: number;
        public jGlobal: number;

        constructor(
            public map: PointsMap,
            public i: number = 0,
            public j: number = 0,
            public value: number = 0
        ) {
            this.iGlobal = this.map.iMap * PointsMapGenerator.MAP_SIZE + this.i;
            this.jGlobal = this.map.jMap * PointsMapGenerator.MAP_SIZE + this.j;
        }
    }

    export class PointsMap {
        public points: Point[] = []; 
        public min: number = 0;
        public max: number = 0;
        public lastUsageTime: number;

        constructor(public pointsMapGenerator: PointsMapGenerator, public iMap: number, public jMap: number) {
            this.lastUsageTime = performance.now();
        }
    }

    export class PointsMapGenerator {
        public static MAP_SIZE: number = 256;

        public maxFrameTimeMS: number = 15;
        public maxCachedMaps: number = 1000;
        public pointsMaps: PointsMap[] = [];

        constructor(public seededMap: SeededMap) {
            
        }

        public getPointsToRef(iGlobalMin: number, iGlobalMax: number, jGlobalMin: number, jGlobalMax: number, ref: Point[]): void {
            let index = 0;

            let IMapMin = Math.floor(iGlobalMin / PointsMapGenerator.MAP_SIZE);
            let IMapMax = Math.ceil(iGlobalMax / PointsMapGenerator.MAP_SIZE);
            let JMapMin = Math.floor(jGlobalMin / PointsMapGenerator.MAP_SIZE);
            let JMapMax = Math.ceil(jGlobalMax / PointsMapGenerator.MAP_SIZE);

            for (let iMap = IMapMin; iMap <= IMapMax; iMap++) {
                for (let jMap = JMapMin; jMap <= JMapMax; jMap++) {
                    let map = this.getMap(iMap, jMap);
                    map.points.forEach(point => {
                        if (point.iGlobal >= iGlobalMin && point.iGlobal <= iGlobalMax) {
                            if (point.jGlobal >= jGlobalMin && point.jGlobal <= jGlobalMax) {
                                ref[index] = point;
                                index++;
                            }
                        }
                    })
                }
            }

            ref[index] = undefined;
        }

        public getMap(IMap: number, JMap: number): PointsMap {
            let map = this.pointsMaps.find((map) => {
                return map.iMap === IMap && map.jMap === JMap;
            });
            if (!map) {
                map = new PointsMap(this, IMap, JMap);
                this.generateMapData(map);
                this.pointsMaps.push(map);
                this.updateDetailedCache();
            }
            map.lastUsageTime = performance.now();
            return map;
        }

        public updateDetailedCache(): void {
            while (this.pointsMaps.length > this.maxCachedMaps) {
                this.pointsMaps = this.pointsMaps.sort((a, b) => {
                    return a.lastUsageTime - b.lastUsageTime;
                });
                this.pointsMaps.splice(0, 1);
            }
        }

        public generateMapData(map: PointsMap): void {
            map.points = [];
            let n = 50;
            for (let i = 0; i < n; i++) {
                let point = new Point(
                    map,
                    Math.floor(Math.random() * PointsMapGenerator.MAP_SIZE),
                    Math.floor(Math.random() * PointsMapGenerator.MAP_SIZE),
                    Math.floor(Math.random() * 2),
                )
                map.points.push(point);
            }
        }
    }
}
