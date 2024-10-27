namespace Nabu {

    export class UniqueList<T> {

        private _elements: T[] = [];
        public get array(): T[] {
            return this._elements;
        }

        public get length(): number {
            return this._elements.length;
        }

        public get(i: number): T {
            return this._elements[i];
        }

        public getLast(): T {
            return this.get(this.length - 1);
        }

        public indexOf(e: T) {
            return this._elements.indexOf(e);
        }

        public push(...elements: T[]) {
            elements.forEach((e: T) => {
                if (this._elements.indexOf(e) === -1) {
                    this._elements.push(e);
                }
            })
        }

        public remove(e: T): T {
            let i = this._elements.indexOf(e);
            if (i != -1) {
                this._elements.splice(i, 1);
                return e;
            }
            return undefined;
        }

        public removeAt(i: number): T {
            if (i >= 0 && i < this._elements.length) {
                let e = this._elements.splice(i, 1);
                return e[0];
            }
        }

        public contains(e: T): boolean {
            return this._elements.indexOf(e) != - 1;
        }

        public forEach(callback: (e: T) => void): void {
            this._elements.forEach(e => {
                callback(e);
            });
        }

        public sort(callback: (e1: T, e2: T) => number): void {
            this._elements = this._elements.sort(callback);
        }

        public cloneAsArray(): T[] {
            return [...this._elements];
        }
    }
}