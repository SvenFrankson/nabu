namespace Nabu {

    export class InputNumber extends HTMLElement {
        
        public static get observedAttributes() {
            return [
                "decimals"
            ];
        }

        private _decimals: number = 3;
        private _n: number = 0;
        
        private _nElement: HTMLInputElement;

        private _updateInterval: number;

        public connectedCallback() {
            this.initialize();
            this._updateInterval = setInterval(this._update, 100);
        }

        private _update = () => {
            if (!this.isConnected) {
                clearInterval(this._updateInterval);
            }
        }

        public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            if (this._initialized) {
                if (name === "decimals") {
                    let value = parseInt(newValue);
                    if (isFinite(value)) {
                        this._decimals = value;
                    }
                    this.setValue(this._n);
                }
            }
        }

        private _setValueProps(e: HTMLInputElement) {
            e.setAttribute("type", "number");
            e.setAttribute("step", "0.05");
            e.addEventListener("input", this._onInputCallback);
            e.classList.add("input-vec3-value");
            e.style.display = "inline-block";
            e.style.width = "90%";
        }

        private _initialized: boolean = false;
        public initialize(): void {
            if (!this._initialized) {
                this.style.display = "inline-block";
                this.style.textAlign = "center";
                
                this._nElement = document.createElement("input");
                this._setValueProps(this._nElement);
                this.appendChild(this._nElement);

                this._initialized = true;

                for (let i = 0; i < DebugDisplayVector3Value.observedAttributes.length; i++) {
                    let name = DebugDisplayVector3Value.observedAttributes[i];
                    let value = this.getAttribute(name);
                    this.attributeChangedCallback(name, value + "_forceupdate", value);
                }
            }
        }

        public setValue(n: number): void {
            if (isFinite(n)) {
                this._n = n;
            }
            
            this._nElement.value = this._n.toFixed(this._decimals);
        }

        public onInputNCallback: (n: number) => void;

        private _onInputCallback = () => {
            this._n = parseFloat(this._nElement.value);

            if (this.onInputNCallback) {
                this.onInputNCallback(this._n);
            }
        }
    }

    customElements.define("input-number", InputNumber);
}