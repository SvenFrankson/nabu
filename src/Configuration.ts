namespace Nabu {

    export enum ConfigurationElementType {
        Boolean,
        Number,
        Enum
    }

    export interface IConfigurationElementValueProp {
        min?: number;
        max?: number;
        step?: number;
        toString?: (v: number) => string;
    }

    export class ConfigurationElement {

        constructor(
            public property: string,
            public type: ConfigurationElementType,
            public value: number,
            public prop?: IConfigurationElementValueProp,
            public onChange?: () => void
        ) {
            if (!this.prop) {
                this.prop = {}
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
    }

    export abstract class Configuration {

        public configurationElements: ConfigurationElement[] = [];

        constructor(public configName: string) {

        }

        public initialize(): void {
            this._buildElementsArray();
            let data = JSON.parse(localStorage.getItem(this.configName));
            this.deserialize(data);
        }

        protected abstract _buildElementsArray(): void;

        public saveToLocalStorage(): void {
            let data = this.serialize();
            localStorage.setItem(this.configName, JSON.stringify(data));
        }

        public serialize(): any {
            let data = {};

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