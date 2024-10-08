namespace Nabu {

    export enum ConfigurationElementCategory {
        Gameplay,
        Graphic,
        Control,
        UI,
        Dev
    }

    export var ConfigurationElementCategoryName: string[] = [
        "Gameplay",
        "Graphic",
        "Control",
        "UI",
        "Dev"
    ]

    export enum ConfigurationElementType {
        Boolean,
        Number,
        Enum,
        Input
    }

    export interface IConfigurationElementValueProp {
        displayName?: string;
        min?: number;
        max?: number;
        step?: number;
        toString?: (v: number) => string;
    }

    export class ConfigurationElement {

        public static Inputs: string[] = [
            "ArrowLeft",
            "ArrowUp",
            "ArrowRight",
            "ArrowDown",
            "Space",
            "ShiftLeft",
            "ControlLeft",
            "AltLeft",
            "ShiftRight",
            "ControlRight",
            "AltRight",
            "Digit1",
            "Digit2",
            "Digit3",
            "Digit4",
            "Digit5",
            "Digit6",
            "Digit7",
            "Digit8",
            "Digit9",
            "Digit0",
            "KeyA",
            "KeyZ",
            "KeyE",
            "KeyR",
            "KeyT",
            "KeyY",
            "KeyU",
            "KeyI",
            "KeyO",
            "KeyP",
            "KeyQ",
            "KeyS",
            "KeyD",
            "KeyF",
            "KeyG",
            "KeyH",
            "KeyJ",
            "KeyK",
            "KeyL",
            "KeyM",
            "KeyW",
            "KeyX",
            "KeyC",
            "KeyV",
            "KeyB",
            "KeyN",
            "GamepadBtn0",
            "GamepadBtn1",
            "GamepadBtn2",
            "GamepadBtn3",
            "GamepadBtn4",
            "GamepadBtn5",
            "GamepadBtn6",
            "GamepadBtn7",
            "GamepadBtn8",
            "GamepadBtn9",
            "GamepadBtn10",
            "GamepadBtn11",
            "GamepadBtn12",
            "GamepadBtn13",
            "GamepadBtn14",
            "GamepadBtn15",
            "GamepadBtn16"
        ];

        public static InputToInt(input: string): number {
            return ConfigurationElement.Inputs.indexOf(input);
        }

        constructor(
            public property: string,
            public type: ConfigurationElementType,
            public value: number,
            public category: ConfigurationElementCategory,
            public prop?: IConfigurationElementValueProp,
            public onChange?: (newValue: number, oldValue?: number, fromUI?: boolean) => void
        ) {
            if (!this.prop) {
                this.prop = {}
            }
            if (!this.prop.displayName) {
                this.prop.displayName = property.split(".")[0];
            }
            if (isNaN(this.prop.min)) {
                this.prop.min = 0;
            }
            if (isNaN(this.prop.max)) {
                this.prop.max = 1000;
            }
            if (isNaN(this.prop.step)) {
                this.prop.step = 1;
            }
            if (!this.prop.toString) {
                this.prop.toString = (v: number) => { return v.toString(); };
            }
        }

        public static SimpleInput(inputManager: InputManager, name: string, keyInput: number, defaultValueString: string): ConfigurationElement {
            return new ConfigurationElement(name, ConfigurationElementType.Input, ConfigurationElement.InputToInt(defaultValueString), ConfigurationElementCategory.Control, {}, (newValue: number, oldValue: number) => {
                if (isFinite(oldValue)) {
                    inputManager.unMapInput(ConfigurationElement.Inputs[oldValue], keyInput);
                }
                inputManager.mapInput(ConfigurationElement.Inputs[newValue], keyInput);
            })
        }

        public forceInit(): void {
            if (this.onChange && isFinite(this.value)) {
                this.onChange(this.value);
            } 
        }
    }

    export abstract class Configuration {

        public hasLocalStorage: boolean = false;
        public configurationElements: ConfigurationElement[] = [];
        public overrideConfigurationElementCategoryName: string[];

        constructor(public configName: string, public version: number = 0) {

        }

        public initialize(): void {
            this._buildElementsArray();
            if (this.hasLocalStorage) {
                let data = JSON.parse(localStorage.getItem(this.configName));
                if (data && data.v === this.version) {
                    this.deserialize(data);
                }
            }
        }

        protected abstract _buildElementsArray(): void;

        public getElement(property: string): ConfigurationElement {
            return this.configurationElements.find(e => { return e.property === property; });
        }

        public getValue(property: string): number {
            let element = this.getElement(property);
            if (element) {
                return element.value;
            }
            return undefined;
        }

        public onValueChange: (e: ConfigurationElement) => void;
        public setValue(property: string, value: number, doForceInit?: boolean, skipSaveToLocalStorage?: boolean): void {
            let element = this.getElement(property);
            if (element) {
                if (element.value != value) {
                    element.value = value;
                    if (doForceInit) {
                        element.forceInit();
                    }
                    if (this.hasLocalStorage && !skipSaveToLocalStorage) {
                        this.saveToLocalStorage();
                    }
                    if (this.onValueChange) {
                        this.onValueChange(element);
                    }
                }
            }
        }

        public saveToLocalStorage(): void {
            let data = this.serialize();
            localStorage.setItem(this.configName, JSON.stringify(data));
        }

        public serialize(): any {
            let data = { v: this.version };

            this.configurationElements.forEach(configurationElement => {
                data[configurationElement.property] = configurationElement.value;
            });

            return data;
        }

        public deserialize(data: any): void {
            if (data) {
                this.configurationElements.forEach(configurationElement => {
                    let v = data[configurationElement.property];
                    if (v != undefined) {
                        configurationElement.value = v;
                    }
                })
            }
        }
    }
}