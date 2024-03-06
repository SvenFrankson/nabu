namespace Nabu {
    
    export class OptionPage extends HTMLElement implements IPage {
        public static get observedAttributes() {
            return [];
        }

        private _loaded: boolean = false;
        private _shown: boolean = false;

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

        public connectedCallback(): void {
            this.style.display = "none";
            this.style.opacity = "0";
        }

        public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            
        }

        public async show(duration: number = 1): Promise<void> {
            return new Promise<void>((resolve) => {
                if (!this._shown) {
                    this._shown = true;
                    this.style.display = "block";
                    let opacity0 = parseFloat(this.style.opacity);
                    let opacity1 = 1;
                    let t0 = performance.now();
                    let step = () => {
                        let t = performance.now();
                        let dt = (t - t0) / 1000;
                        if (dt >= duration) {
                            this.style.opacity = "1";
                            resolve();
                        }
                        else {
                            let f = dt / duration;
                            this.style.opacity = ((1 - f) * opacity0 + f * opacity1).toFixed(2);
                            requestAnimationFrame(step);
                        }
                    }
                    step();
                }
            });
        }

        public async hide(duration: number = 1): Promise<void> {
            if (duration === 0) {
                this._shown = false;
                this.style.display = "none";
                this.style.opacity = "0";
            } else {
                return new Promise<void>((resolve) => {
                    if (this._shown) {
                        this._shown = false;
                        this.style.display = "block";
                        let opacity0 = parseFloat(this.style.opacity);
                        let opacity1 = 0;
                        let t0 = performance.now();
                        let step = () => {
                            let t = performance.now();
                            let dt = (t - t0) / 1000;
                            if (dt >= duration) {
                                this.style.display = "none";
                                this.style.opacity = "0";
                                resolve();
                            }
                            else {
                                let f = dt / duration;
                                this.style.opacity = ((1 - f) * opacity0 + f * opacity1).toFixed(2);
                                requestAnimationFrame(step);
                            }
                        }
                        step();
                    }
                });
            }
        }
    }

    customElements.define("option-page", OptionPage);
}
