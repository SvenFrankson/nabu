namespace Nabu {

    export interface IVector3XYZValue {
        x: number;
        y: number;
        z: number;
    }

    export interface IVector3IJKValue {
        i: number;
        j: number;
        k: number;
    }

    export class InputVector3 extends HTMLElement {
        
        public static get observedAttributes() {
            return [
                "label",
                "useIJK",
                "decimals"
            ];
        }

        private _useIJK: boolean = false;
        private _decimals: number = 3;
        private _x: number = 0;
        private _y: number = 0;
        private _z: number = 0;
        
        private _xElement: HTMLInputElement;
        private _xLabelElement: HTMLSpanElement;
        private _yElement: HTMLInputElement;
        private _yLabelElement: HTMLSpanElement;
        private _zElement: HTMLInputElement;
        private _zLabelElement: HTMLSpanElement;

        private _updateInterval: number;
        public targetXYZ: IVector3XYZValue;

        public connectedCallback() {
            this.initialize();
            this._updateInterval = setInterval(this._update, 100);
        }

        private _update = () => {
            if (!this.isConnected) {
                clearInterval(this._updateInterval);
            }
            if (this.targetXYZ && (this.targetXYZ.x != this._x || this.targetXYZ.y != this._y || this.targetXYZ.z != this._z)) {
                this._x = this.targetXYZ.x;
                this._y = this.targetXYZ.y;
                this._z = this.targetXYZ.z;
                this.setValue(this.targetXYZ);
            }
        }

        public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            if (this._initialized) {
                if (name === "useIJK") {
                    this._useIJK = newValue === "true" ? true : false;
                    if (this._useIJK) {
                        this._xLabelElement.textContent = "i";
                        this._yLabelElement.textContent = "j";
                        this._zLabelElement.textContent = "k";
                    }
                    else {
                        this._xLabelElement.textContent = "x";
                        this._yLabelElement.textContent = "y";
                        this._zLabelElement.textContent = "z";
                    }
                }
                if (name === "decimals") {
                    let value = parseInt(newValue);
                    if (isFinite(value)) {
                        this._decimals = value;
                    }
                    this.setValue({
                        x: this._x,
                        y: this._y,
                        z: this._z
                    });
                }
            }
        }

        private _setLabelProps(e: HTMLSpanElement) {
            e.classList.add("input-vec3-label");
            e.style.display = "inline-block";
            e.style.textAlign = "center";
            e.style.width = "18px";
        }

        private _setValueProps(e: HTMLInputElement) {
            e.setAttribute("type", "number");
            e.setAttribute("step", "0.001");
            e.addEventListener("input", this._onInputCallback);
            e.classList.add("input-vec3-value");
            e.style.display = "inline-block";
            e.style.width = "24%";
        }

        private _initialized: boolean = false;
        public initialize(): void {
            if (!this._initialized) {
                this.style.display = "inline-block";
                
                this._xLabelElement = document.createElement("span");
                this._setLabelProps(this._xLabelElement);
                this.appendChild(this._xLabelElement);

                this._xElement = document.createElement("input");
                this._setValueProps(this._xElement);
                this.appendChild(this._xElement);
                
                this._yLabelElement = document.createElement("span");
                this._setLabelProps(this._yLabelElement);
                this.appendChild(this._yLabelElement);

                this._yElement = document.createElement("input");
                this._setValueProps(this._yElement);
                this.appendChild(this._yElement);
                
                this._zLabelElement = document.createElement("span");
                this._setLabelProps(this._zLabelElement);
                this.appendChild(this._zLabelElement);

                this._zElement = document.createElement("input");
                this._setValueProps(this._zElement);
                this.appendChild(this._zElement);

                this._initialized = true;

                for (let i = 0; i < DebugDisplayVector3Value.observedAttributes.length; i++) {
                    let name = DebugDisplayVector3Value.observedAttributes[i];
                    let value = this.getAttribute(name);
                    this.attributeChangedCallback(name, value + "_forceupdate", value);
                }
            }
        }

        public setValue(vec3: IVector3XYZValue): void;
        public setValue(vec3: IVector3IJKValue): void;
        public setValue(i: number, j: number, k: number): void;
        public setValue(vec3: any, j?: number, k?: number): void {
            if (isFinite(j) && isFinite(k)) {
                this._x = vec3;
                this._y = j;
                this._z = k;
            }
            else {
                this._x = isFinite(vec3.x) ? vec3.x : vec3.i;
                this._y = isFinite(vec3.y) ? vec3.y : vec3.j;
                this._z = isFinite(vec3.z) ? vec3.z : vec3.k;
            }
            
            this._xElement.value = this._x.toFixed(this._decimals);
            this._yElement.value = this._y.toFixed(this._decimals);
            this._zElement.value = this._z.toFixed(this._decimals);
        }

        public onInputXYZCallback: (xyz: IVector3XYZValue) => void;

        private _onInputCallback = () => {
            this._x = parseFloat(this._xElement.value);
            this._y = parseFloat(this._yElement.value);
            this._z = parseFloat(this._zElement.value);

            if (this.targetXYZ) {
                this.targetXYZ.x = this._x;
                this.targetXYZ.y = this._y;
                this.targetXYZ.z = this._z;
            }

            if (this.onInputXYZCallback) {
                this.onInputXYZCallback({
                    x: this._x,
                    y: this._y,
                    z: this._z
                });
            }
        }
    }

    customElements.define("input-vec3", InputVector3);
}