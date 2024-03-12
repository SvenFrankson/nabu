namespace Nabu {

    export class VoronoiCell {

        public center: Vector2;
        public polygon: Vector2[];
        public edges: UniqueList<VoronoiCell> = new UniqueList<VoronoiCell>();

        constructor(public diagram: VoronoiDiagram, public i: number, public j: number) {
            this.center = new Vector2();
        }

        public getPolygon(): Vector2[] {
            if (this.polygon) {
                return this.polygon;
            }

            // create connections
            let cell00 = this.diagram.getCell(this.i - 1, this.j - 1);
            let cell10 = this.diagram.getCell(this.i + 0, this.j - 1);
            let cell20 = this.diagram.getCell(this.i + 1, this.j - 1);
            let cell01 = this.diagram.getCell(this.i - 1, this.j + 0);
            let cell11 = this;
            let cell21 = this.diagram.getCell(this.i + 1, this.j + 0);
            let cell02 = this.diagram.getCell(this.i - 1, this.j + 1);
            let cell12 = this.diagram.getCell(this.i + 0, this.j + 1);
            let cell22 = this.diagram.getCell(this.i + 1, this.j + 1);

            this.connect(cell10);
            this.connect(cell01);
            this.connect(cell21);
            this.connect(cell12);

            if (Vector2.DistanceSquared(cell00.center, cell11.center) < Vector2.DistanceSquared(cell10.center, cell01.center)) {
                cell00.connect(cell11);
            }
            else {
                cell10.connect(cell01);
            }

            if (Vector2.DistanceSquared(cell10.center, cell21.center) < Vector2.DistanceSquared(cell20.center, cell11.center)) {
                cell10.connect(cell21);
            }
            else {
                cell20.connect(cell11);
            }

            if (Vector2.DistanceSquared(cell01.center, cell12.center) < Vector2.DistanceSquared(cell11.center, cell02.center)) {
                cell01.connect(cell12);
            }
            else {
                cell11.connect(cell02);
            }

            if (Vector2.DistanceSquared(cell11.center, cell22.center) < Vector2.DistanceSquared(cell21.center, cell12.center)) {
                cell11.connect(cell22);
            }
            else {
                cell21.connect(cell12);
            }

            this.polygon = [];
            if (this.isConnectedTo(cell20)) {
                this.polygon.push(Vector2.Average(cell11.center, cell10.center, cell20.center));
                this.polygon.push(Vector2.Average(cell11.center, cell20.center, cell21.center));
            }
            else {
                this.polygon.push(Vector2.Average(cell11.center, cell10.center, cell21.center));
            }
            if (this.isConnectedTo(cell22)) {
                this.polygon.push(Vector2.Average(cell11.center, cell21.center, cell22.center));
                this.polygon.push(Vector2.Average(cell11.center, cell22.center, cell12.center));
            }
            else {
                this.polygon.push(Vector2.Average(cell11.center, cell21.center, cell12.center));
            }
            if (this.isConnectedTo(cell02)) {
                this.polygon.push(Vector2.Average(cell11.center, cell12.center, cell02.center));
                this.polygon.push(Vector2.Average(cell11.center, cell02.center, cell01.center));
            }
            else {
                this.polygon.push(Vector2.Average(cell11.center, cell12.center, cell01.center));
            }
            if (this.isConnectedTo(cell00)) {
                this.polygon.push(Vector2.Average(cell11.center, cell01.center, cell00.center));
                this.polygon.push(Vector2.Average(cell11.center, cell00.center, cell10.center));
            }
            else {
                this.polygon.push(Vector2.Average(cell11.center, cell01.center, cell10.center));
            }

            return this.polygon;
        }

        public connect(other: VoronoiCell): void {
            this.edges.push(other);
            other.edges.push(this);
        }

        public isConnectedTo(other: VoronoiCell): boolean {
            return this.edges.contains(other);
        }
    }

    export class VoronoiDiagram {
    
        public static colors: string[] = [
            "#000000",
            "#ff0000",
            "#00ff00",
            "#0000ff",
            "#ffff00",
            "#00ffff",
            "#ff00ff",
            "#ffffff"
        ]
        public cells: VoronoiCell[][];
    
        constructor(public cellSize: number, public cellSpread: number = 0.5) {
            
        }

        public getCell(i: number, j: number) {
            if (!this.cells) {
                this.cells = [];
            }
            if (!this.cells[i]) {
                this.cells[i] = [];
            }
            if (!this.cells[i][j]) {
                let cell = new VoronoiCell(this, i, j);
                cell.center.x = (i + 0.5) * this.cellSize + (Math.random() - 0.5) * this.cellSize * this.cellSpread;
                cell.center.y = (j + 0.5) * this.cellSize + (Math.random() - 0.5) * this.cellSize * this.cellSpread
                this.cells[i][j] = cell;
            }
            return this.cells[i][j];
        }

        public async downloadAsPNG(size: number): Promise<void> {
            let canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            let context = canvas.getContext("2d");

            let count = Math.floor(size / this.cellSize);
            for (let i = 0; i < count; i++) {
                for (let j = 0; j < count; j++) {
                    let cell = this.getCell(i, j);
                    let polygon = cell.getPolygon();
                    context.fillStyle = VoronoiDiagram.colors[Math.floor(Math.random() * VoronoiDiagram.colors.length)];
                    context.beginPath();
                    context.moveTo(polygon[0].x, polygon[0].y);
                    for (let i = 1; i < polygon.length; i++) {
                        context.lineTo(polygon[i].x, polygon[i].y);
                    }
                    context.closePath();
                    context.fill();
                }
            }

            var a = document.createElement("a");
            a.setAttribute("href", canvas.toDataURL());
            a.setAttribute("download", "voronoi_diagram.png");

            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
}
