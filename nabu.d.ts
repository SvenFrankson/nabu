declare namespace Nabu {
    class Easing {
        static easeOutCubic(x: number): number;
        static easeInOutSine(x: number): number;
        static easeOutElastic(x: number): number;
        static easeInOutBack(x: number): number;
        static smooth010Sec(fps: number): number;
        static smooth025Sec(fps: number): number;
        static smooth05Sec(fps: number): number;
        static smooth1Sec(fps: number): number;
        static smooth2Sec(fps: number): number;
        static smooth3Sec(fps: number): number;
    }
}
declare namespace Nabu {
    interface IJK {
        i: number;
        j: number;
        k: number;
    }
}
declare namespace Nabu {
    function Pow2(n: number): number;
    function RoundPow2Exponent(n: number): number;
    function CeilPow2Exponent(n: number): number;
}
declare namespace Nabu {
    class UniqueList<T> {
        private _elements;
        get length(): number;
        get(i: number): T;
        getLast(): T;
        indexOf(e: T): number;
        push(e: T): void;
        remove(e: T): T;
        contains(e: T): boolean;
        forEach(callback: (e: T) => void): void;
        sort(callback: (e1: T, e2: T) => number): void;
    }
}
declare namespace Nabu {
    class DebugDisplayColorInput extends HTMLElement {
        static get observedAttributes(): string[];
        private _label;
        private _labelElement;
        private _colorInput;
        private _colorFloat;
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        private _initialized;
        initialize(): void;
        private _onInput;
        onInput: (hexColor: string) => void;
        setColor(hexColor: string): void;
    }
}
declare namespace Nabu {
    class DebugDisplayFrameValue extends HTMLElement {
        static get observedAttributes(): string[];
        size: number;
        frameCount: number;
        private _minValue;
        private _maxValue;
        private _values;
        private _label;
        private _minElement;
        private _maxElement;
        private _labelElement;
        private _valuesElement;
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        private _initialized;
        initialize(): void;
        private _redraw;
        addValue(v: number): void;
    }
}
declare namespace Nabu {
    class DebugDisplayTextValue extends HTMLElement {
        static get observedAttributes(): string[];
        private _label;
        private _labelElement;
        private _textElement;
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        private _initialized;
        initialize(): void;
        setText(text: string): void;
    }
}
declare namespace Nabu {
    interface IVector3XYZValue {
        x: number;
        y: number;
        z: number;
    }
    interface IVector3IJKValue {
        i: number;
        j: number;
        k: number;
    }
    class DebugDisplayVector3Value extends HTMLElement {
        static get observedAttributes(): string[];
        private _label;
        private _useIJK;
        private _decimals;
        private _x;
        private _y;
        private _z;
        private _labelElement;
        private _xElement;
        private _xLabelElement;
        private _yElement;
        private _yLabelElement;
        private _zElement;
        private _zLabelElement;
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        private _initialized;
        initialize(): void;
        setValue(vec3: IVector3XYZValue): void;
        setValue(vec3: IVector3IJKValue): void;
        setValue(i: number, j: number, k: number): void;
    }
}
declare namespace Nabu {
    var PIString: string;
}
declare namespace Nabu {
    class RandSeed {
        stringInput: string;
        values: number[];
        constructor(stringInput: string);
        static EasyHash(stringInput: string): number;
    }
    class Rand {
        L: number;
        values: number[];
        constructor();
        getValue1D(seed: RandSeed, i: number): number;
        getValue3D(seed: RandSeed, i: number, j: number, k: number): number;
        getValue4D(seed: RandSeed, i: number, j: number, k: number, d: number): number;
    }
    var RAND: Rand;
}
