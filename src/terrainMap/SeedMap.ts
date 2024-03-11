namespace Nabu {
    export class SeedMap {
        public _data: Uint8ClampedArray;
        constructor(public name: string, public size: number) {
            this._data = new Uint8ClampedArray(this.size * this.size);
        }

        public getData(i: number, j: number): number {
            i = i % this.size;
            j = j % this.size;
            return this._data[i + j * this.size];
        }

        public setData(i: number, j: number, v: number): void {
            this._data[i + j * this.size] = v;
        }

        public randomFill(): void {
            for (let i = 0; i < this._data.length; i++) {
                this._data[i] = Math.floor(Math.random() * 128 + 64);
            }
        }

        public fillFromBaseSeedMap(baseSeedMap: Uint8ClampedArray, n: number, IMap: number, JMap: number): void {
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    let I = i + this.size * IMap;
                    let J = j + this.size * JMap;
                    this._data[i + j * this.size] = baseSeedMap[I + J * n];
                }
            }
        }

        public fillFromPNG(url: string): Promise<void> {
            return new Promise<void>((resolve) => {
                let image = document.createElement("img");
                image.src = url;
                image.onload = () => {
                    let canvas = document.createElement("canvas");
                    this.size = Math.min(image.width, image.height);
                    this._data = new Uint8ClampedArray(this.size * this.size);
                    canvas.height = this.size;
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);
                    let imgData = ctx.getImageData(0, 0, this.size, this.size).data;
                    for (let i = 0; i < this._data.length; i++) {
                        this._data[i] = imgData[4 * i];
                    }
                    resolve();
                };
            });
        }

        public downloadAsPNG(): void {
            let canvas = document.createElement("canvas");
            canvas.width = this.size;
            canvas.height = this.size;

            let context = canvas.getContext("2d");
            let pixels = new Uint8ClampedArray(this._data.length * 4);
            for (let i = 0; i < this._data.length; i++) {
                pixels[4 * i] = this._data[i];
                pixels[4 * i + 1] = this._data[i];
                pixels[4 * i + 2] = this._data[i];
                pixels[4 * i + 3] = 255;
            }
            context.putImageData(new ImageData(pixels, this.size, this.size), 0, 0);

            var a = document.createElement("a");
            a.setAttribute("href", canvas.toDataURL());
            a.setAttribute("download", this.name + ".png");

            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
}
