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
            let lastCategory: ConfigurationElementCategory;
            let lastInputLabel: string;
            let lastValueBlock: HTMLDivElement;

            for (let i = 0; i < configuration.configurationElements.length; i++) {
                let configElement = configuration.configurationElements[i];

                if (configElement.category != lastCategory) {
                    let h2 = document.createElement("h2");
                    h2.classList.add("category");
                    h2.innerHTML = ConfigurationElementCategoryName[configElement.category];
                    this._container.appendChild(h2);
                    lastCategory = configElement.category;
                }

                let labelString = configElement.prop.displayName.split(".")[0];
                let valueBlock = lastValueBlock;
                if (labelString != lastInputLabel) {
                    let line = document.createElement("div");
                    line.classList.add("line");
                    this._container.appendChild(line);
    
                    let label = document.createElement("div");
                    label.classList.add("label");
                    if (configElement.type === ConfigurationElementType.Input) {
                        label.classList.add("input");
                    }
                    label.innerHTML = labelString;
                    label.style.display = "inline-block";
                    label.style.marginLeft = "1%";
                    label.style.marginRight = "1%";
                    label.style.paddingLeft = "1.5%";
                    label.style.paddingRight = "1.5%";
                    label.style.width = "45%";
                    line.appendChild(label);
    
                    valueBlock = document.createElement("div");
                    valueBlock.classList.add("value-block");
                    valueBlock.style.display = "inline-block";
                    valueBlock.style.marginLeft = "1%";
                    valueBlock.style.marginRight = "1%";
                    valueBlock.style.paddingLeft = "1.5%";
                    valueBlock.style.paddingRight = "1.5%";
                    valueBlock.style.width = "45%";
                    line.appendChild(valueBlock);
                }

                if (configElement.type === ConfigurationElementType.Boolean) {
                    let checkbox = document.createElement("nabu-checkbox") as Nabu.NabuCheckBox;
                    checkbox.classList.add("option-button");
                    valueBlock.appendChild(checkbox);
                    checkbox.value = configElement.value;
                    checkbox.onChange = () => {
                        configElement.value = checkbox.value;
                        this.configuration.saveToLocalStorage();
                        if (configElement.onChange) {
                            configElement.onChange(checkbox.value);
                        }
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
                            if (configElement.onChange) {
                                configElement.onChange(configElement.value);
                            }
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
                            if (configElement.onChange) {
                                configElement.onChange(configElement.value);
                            }
                        }
                    }
                }
                else if (configElement.type === ConfigurationElementType.Input){
                    let numValue = document.createElement("div");
                    numValue.classList.add("input-value");
                    numValue.innerHTML = (ConfigurationElement.Inputs[configElement.value]).replace("GamepadBtn", "Pad ").replace("Key", "Key ");
                    valueBlock.appendChild(numValue);

                    numValue.onclick = () => {
                        numValue.innerHTML = "press...";

                        let keyup = (ev: KeyboardEvent) => {
                            let oldValue = configElement.value;
                            let newValue = ConfigurationElement.InputToInt(ev.code);
                            if (newValue > - 1) {
                                configElement.value = newValue;
                                configElement.onChange(newValue, oldValue);
                            }
                            exit();
                        };

                        let waitForGamepad = setInterval(() => {
                            let gamepads = navigator.getGamepads();
                            let gamepad = gamepads[0];
                            if (gamepad) {
                                for (let b = 0; b < gamepad.buttons.length; b++) {
                                    let v = gamepad.buttons[b].pressed;
                                    if (v) {
                                        let oldValue = configElement.value;
                                        let newValue = ConfigurationElement.InputToInt("GamepadBtn" + b);
                                        if (newValue > - 1) {
                                            configElement.value = newValue;
                                            configElement.onChange(newValue, oldValue);
                                        }
                                        exit();
                                    }
                                }
                            }
                        }, 15);

                        let exit = () => {
                            numValue.innerHTML = (ConfigurationElement.Inputs[configElement.value]).replace("GamepadBtn", "Pad ").replace("Key", "Key ");
                            window.removeEventListener("keyup", keyup);
                            window.clearInterval(waitForGamepad);
                        }

                        window.addEventListener("keyup", keyup);
                        window.addEventListener("pointerdown", exit);
                    }
                }
                
                if (configElement.type === ConfigurationElementType.Input) {
                    lastInputLabel = labelString;
                    lastValueBlock = valueBlock;
                }
                else {
                    lastInputLabel = "";
                    lastValueBlock = undefined;
                }
            }
        }
    }

    customElements.define("option-page", OptionPage);
}
