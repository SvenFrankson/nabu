namespace Nabu {

    export enum ConfigurationElementType {
        Boolean,
        Number,
        Enum
    }

    export interface IConfigurationElementValueProp {
        displayName?: string;
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
            public onChange?: (v: number) => void
        ) {
            if (!this.prop) {
                this.prop = {}
            }
            if (!this.prop.displayName) {
                this.prop.displayName = property;
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

        public getValue(property: string): number {
            let element = this.configurationElements.find(e => { return e.property === property; });
            if (element) {
                return element.value;
            }
            return undefined;
        }

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