namespace Nabu {

    export class NabuCheckBox extends HTMLElement {

        private _value: number;

        public static get observedAttributes() {
            return [
                "value"
            ];
        }

        public connectedCallback(): void {
            this.onclick = () => {
                this.value = this.value === 1 ? 0 : 1;
            }
        }

        public onChange = () => {};

        public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            if (name === "value") {
                if (oldValue != newValue) {
                    this.setValue(parseInt(newValue));
                }
            }
        }

        public get valueBool(): boolean {
            return this._value === 1 ? true : false;
        }
        public get value(): number {
            return this._value;
        }
        public set value(v: number) {
            this.setValue(v);
        }

        public setValue(v: boolean | number): void {
            let numV: number;
            if (typeof(v) === "boolean") {
                numV = v ? 1 : 0;
            }
            else {
                numV = v <= 0 ? 0 : 1;
            }
            if (numV != this._value) {
                this._value = numV;
                this.setAttribute("value", this._value.toFixed(0));
                if (this.onChange) {
                    this.onChange();
                }
            }
        }
    }

    customElements.define("nabu-checkbox", NabuCheckBox);
}