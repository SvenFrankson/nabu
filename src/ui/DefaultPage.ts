namespace Nabu {
    
    export class DefaultPage extends HTMLElement implements IPage {
        public static get observedAttributes() {
            return [
                "file"
            ];
        }

        public pointerBlocker: HTMLDivElement;

        private _loaded: boolean = false;
        public get loaded(): boolean {
            return this._loaded;
        }
        private _shown: boolean = false;
        public get shown(): boolean {
            return this._shown;
        }

        private _onLoad: () => void;
        public get onLoad(): () => void {
            return this._onLoad;
        }
        public set onLoad(callback: () => void) {
            this._onLoad = callback;
            if (this._loaded) {
                this._onLoad();
            }
        }

        public async waitLoaded(): Promise<void> {
            return new Promise<void>(resolve => {
                let wait = () => {
                    if (this._loaded) {
                        resolve();
                    }
                    else {
                        requestAnimationFrame(wait);
                    }
                }
                wait();
            })
        }

        public connectedCallback(): void {
            let file = this.getAttribute("file");
            if (file) {
                this.attributeChangedCallback("file", "", file);
            }
            this._shown = false;
            this.hide(0);
        }

        public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            if (name === "file") {
                if (this.isConnected) {
                    const xhttp = new XMLHttpRequest();
                    xhttp.onload = () => {
                        this.innerHTML = xhttp.responseText;

                        this.pointerBlocker = document.createElement("div");
                        this.pointerBlocker.style.position = "absolute";
                        this.pointerBlocker.style.left = "0";
                        this.pointerBlocker.style.top = "0";
                        this.pointerBlocker.style.width = "100%";
                        this.pointerBlocker.style.height = "100%";
                        this.pointerBlocker.style.zIndex = "10";
                        this.pointerBlocker.style.backgroundColor = "magenta";
                        this.pointerBlocker.style.opacity = "0";
                        this.appendChild(this.pointerBlocker);
                        
                        this._loaded = true;
                        if (this._onLoad) {
                            this._onLoad();
                        }
                    };
                    xhttp.open("GET", newValue);
                    xhttp.send();
                }
            }
        }

        private _timout: number = -1;

        public showFast(): void {
            clearTimeout(this._timout);
            this._shown = true;
            this.style.display = "";
            this.style.opacity = "1";
            this.onshow();
        }

        public hideFast(duration: number = 1): void {
            clearTimeout(this._timout);
            this._shown = false;
            this.style.opacity = "0";
            this.onhide();
            this._timout = setTimeout(() => {
                this.style.display = "none";
            }, duration * 1000);
        }

        private _showing: boolean = false;
        public async show(duration: number = 1): Promise<void> {
            return new Promise<void>((resolve) => {
                this._showing = true;
                this._hiding = false;
                this._shown = true;
                this.style.display = "";
                this.onshow();

                let opacity0 = parseFloat(this.style.opacity);
                let opacity1 = 1;
                let t0 = performance.now();
                let step = () => {
                    if (this._hiding) {
                        return;
                    }
                    let t = performance.now();
                    let dt = (t - t0) / 1000;
                    if (dt >= duration) {
                        this.style.opacity = "1";
                        if (this.pointerBlocker) {
                            this.pointerBlocker.style.display = "none";
                        }
                        this._showing = false;
                        resolve();
                    }
                    else {
                        let f = dt / duration;
                        this.style.opacity = ((1 - f) * opacity0 + f * opacity1).toFixed(2);
                        requestAnimationFrame(step);
                    }
                }
                step();
            });
        }

        public onshow = () => {};

        private _hiding: boolean = false;
        public async hide(duration: number = 1): Promise<void> {
            if (!this._shown) {
                return;
            }
            return new Promise<void>((resolve) => {
                this._showing = false;
                this._hiding = true;
                this.style.display = "";
                if (this.pointerBlocker) {
                    this.pointerBlocker.style.display = "";
                }

                let opacity0 = parseFloat(this.style.opacity);
                let opacity1 = 0;
                let t0 = performance.now();
                let step = () => {
                    if (this._showing) {
                        return;
                    }
                    let t = performance.now();
                    let dt = (t - t0) / 1000;
                    if (dt >= duration) {
                        this.style.display = "none";
                        this.style.opacity = "0";
                        this._shown = false;
                        this._hiding = false;
                        this.onhide();
                        resolve();
                    }
                    else {
                        let f = dt / duration;
                        this.style.opacity = ((1 - f) * opacity0 + f * opacity1).toFixed(2);
                        requestAnimationFrame(step);
                    }
                }
                step();
            });
        }

        public onhide = () => {};
    }

    customElements.define("default-page", DefaultPage);
}
