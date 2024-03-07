namespace Nabu {
    
    export class OptionPage extends HTMLElement implements IPage {
        public static get observedAttributes() {
            return [];
        }

        private _loaded: boolean = false;
        private _shown: boolean = false;

        public configuration: Configuration;
        private _title: HTMLHeadingElement;
        private _containerFrame: HTMLDivElement;
        private _container: HTMLDivElement;
        private _backButton: HTMLButtonElement;

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

            this._title = document.createElement("h1");
            this._title.innerHTML = "OPTIONS";
            this.appendChild(this._title);

            this._containerFrame = document.createElement("div");
            this._containerFrame.classList.add("container-frame");
            this.appendChild(this._containerFrame);

            this._container = document.createElement("div");
            this._container.classList.add("container");
            this._containerFrame.appendChild(this._container);

            let a = document.createElement("a");
            a.href = "#home";
            this.appendChild(a);

            this._backButton = document.createElement("button");
            this._backButton.classList.add("back-button");
            this._backButton.innerText = "Back";
            a.appendChild(this._backButton);
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

        public setConfiguration(configuration: Configuration): void {
            this.configuration = configuration;
            for (let i = 0; i < configuration.configurationElements.length; i++) {
                let configElement = configuration.configurationElements[i];

                let line = document.createElement("div");
                line.classList.add("line");
                this._container.appendChild(line);

                let label = document.createElement("div");
                label.classList.add("label");
                label.innerHTML = configElement.property + " " + i.toFixed(0);
                label.style.display = "inline-block";
                label.style.marginLeft = "5%";
                label.style.width = "45%";
                line.appendChild(label);

                let valueBlock = document.createElement("div");
                valueBlock.classList.add("value-block");
                valueBlock.style.display = "inline-block";
                valueBlock.style.marginLeft = "5%";
                valueBlock.style.width = "45%";
                line.appendChild(valueBlock);

                if (configElement.type === ConfigurationElementType.Boolean) {
                    let checkbox = document.createElement("div");
                    checkbox.classList.add("option-button");
                    checkbox.classList.add("boolean-checkbox");
                    valueBlock.appendChild(checkbox);
                    checkbox.setAttribute("value", configElement.value === 1 ? "1" : "0");
                    checkbox.onclick = () => {
                        configElement.value = configElement.value === 1 ? 0 : 1;
                        checkbox.setAttribute("value", configElement.value === 1 ? "1" : "0");
                        this.configuration.saveToLocalStorage();
                    }
                }
                else if (configElement.type === ConfigurationElementType.Number || configElement.type === ConfigurationElementType.Enum){
                    let minus = document.createElement("div");
                    minus.classList.add("option-button");
                    if (configElement.type === ConfigurationElementType.Number) {
                        minus.classList.add("minus");
                    }
                    else {
                        minus.classList.add("prev");
                    }
                    valueBlock.appendChild(minus);
                    minus.onclick = () => {
                        if (configElement.value > configElement.prop.min) {
                            configElement.value = Math.max(configElement.prop.min, configElement.value - configElement.prop.step);
                            numValue.innerHTML = configElement.prop.toString(configElement.value);
                            this.configuration.saveToLocalStorage();
                        }
                    }

                    let numValue = document.createElement("div");
                    numValue.classList.add("value");
                    numValue.innerHTML = configElement.prop.toString(configElement.value);
                    valueBlock.appendChild(numValue);

                    let plus = document.createElement("div");
                    plus.classList.add("option-button");
                    if (configElement.type === ConfigurationElementType.Number) {
                        plus.classList.add("plus");
                    }
                    else {
                        plus.classList.add("next");
                    }
                    valueBlock.appendChild(plus);
                    plus.onclick = () => {
                        if (configElement.value < configElement.prop.max) {
                            configElement.value = Math.min(configElement.prop.max, configElement.value + configElement.prop.step);
                            numValue.innerHTML = configElement.prop.toString(configElement.value);
                            this.configuration.saveToLocalStorage();
                        }
                    }
                }
            }
        }
    }

    customElements.define("option-page", OptionPage);
}
