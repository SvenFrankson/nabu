namespace Nabu {

    export class DebugDisplayColorInput extends HTMLElement {
        
        public static get observedAttributes() {
            return [
                "label"
            ];
        }

        private _label: string;
        
        private _labelElement: HTMLSpanElement;
        private _colorInput: HTMLInputElement;
        private _colorFloat: HTMLSpanElement;

        public connectedCallback() {
            this.initialize();
            this.style.display = "block";
            this.style.width = "400px";
            this.style.marginLeft = "auto";
            this.style.marginBottom = "5px";
        }

        public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            if (this._initialized) {
                if (name === "label") {
                    this._label = newValue;
                    this._labelElement.textContent = this._label;
                }
            }
        }

        private _initialized: boolean = false;
        public initialize(): void {
            if (!this._initialized) {
                this.style.position = "relative";

                this._labelElement = document.createElement("div");
                this._labelElement.style.display = "inline-block";
                this._labelElement.style.width = "33%";
                this._labelElement.style.marginRight = "2%";
                this.appendChild(this._labelElement);

                this._colorInput = document.createElement("input");
                this._colorInput.setAttribute("type", "color");
                this._colorInput.style.display = "inline-block";
                this._colorInput.style.verticalAlign = "middle";
                this._colorInput.style.width = "65%";
                this.appendChild(this._colorInput);

                this._colorInput.oninput = this._onInput;

                this._colorFloat = document.createElement("span");
                this._colorFloat.innerText = "0.324, 0.123, 0.859";
                this._colorFloat.style.display = "block";
                this._colorFloat.style.verticalAlign = "middle";
                this._colorFloat.style.width = "100%";
                this._colorFloat.style.userSelect = "none";
                this._colorFloat.innerText = this._colorInput.value;
                this._colorFloat.onclick = () => {
                    navigator.clipboard.writeText(this._colorFloat.innerText);
                }
                this.appendChild(this._colorFloat);

                this._initialized = true;

                for (let i = 0; i < DebugDisplayFrameValue.observedAttributes.length; i++) {
                    let name = DebugDisplayFrameValue.observedAttributes[i];
                    let value = this.getAttribute(name);
                    this.attributeChangedCallback(name, value + "_forceupdate", value);
                }
            }
        }

        private _onInput = () => {
            this._colorFloat.innerText = this._colorInput.value;
            if (this.onInput) {
                this.onInput(this._colorInput.value);
            }
        }

        public onInput: (hexColor: string) => void;

        public setColor(hexColor: string): void {
            this._colorInput.value = hexColor;
            this._colorFloat.innerText = this._colorInput.value;
        }
    }

    customElements.define("debug-display-color-input", DebugDisplayColorInput);
}