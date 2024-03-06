declare namespace Nabu {
    function Wait(frames?: number): Promise<void>;
}
declare namespace Nabu {
    function Compress(data: Uint8Array): Uint8Array;
    function Decompress(data: Uint8Array): Uint8Array;
}
declare namespace Nabu {
    class Easing {
        static easeInSquare(x: number): number;
        static easeOutSquare(x: number): number;
        static easeInCubic(x: number): number;
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
    function download(filename: string, text: string): void;
}
declare namespace Nabu {
    interface IJK {
        i: number;
        j: number;
        k: number;
    }
}
declare namespace Nabu {
    function MinMax(n: number, min: number, max: number): number;
    function Pow2(n: number): number;
    function FloorPow2Exponent(n: number): number;
    function CeilPow2Exponent(n: number): number;
    function Step(from: number, to: number, step: number): number;
    function StepAngle(from: number, to: number, step: number): number;
    function LerpAngle(from: number, to: number, t: number): number;
    function AngularDistance(from: number, to: number): number;
}
declare namespace Nabu {
    class OctreeNode<T> {
        static NToIJK: {
            i: number;
            j: number;
            k: number;
        }[];
        size: number;
        degree: number;
        parent: OctreeNode<T>;
        children: any[];
        i: number;
        j: number;
        k: number;
        constructor(parent: OctreeNode<T>);
        constructor(degree?: number);
        forEach(callback: (v: T, i: number, j: number, k: number) => void): void;
        forEachNode(callback: (node: OctreeNode<T>) => void): void;
        collapse(): void;
        private _getChild;
        private _setChild;
        private _setNthChild;
        get(i: number, j: number, k: number): T;
        set(v: T, i: number, j: number, k: number): void;
        serializeToString(): string;
        serialize(output?: string[]): string[];
        static DeserializeFromString(strInput: string): OctreeNode<number>;
        static Deserialize(input: string[]): OctreeNode<number>;
    }
}
declare namespace Nabu {
    interface UVW {
        u: number;
        v: number;
        w: number;
    }
}
declare namespace Nabu {
    class UniqueList<T> {
        private _elements;
        get length(): number;
        get(i: number): T;
        getLast(): T;
        indexOf(e: T): number;
        push(...elements: T[]): void;
        remove(e: T): T;
        removeAt(i: number): T;
        contains(e: T): boolean;
        forEach(callback: (e: T) => void): void;
        sort(callback: (e1: T, e2: T) => number): void;
        cloneAsArray(): T[];
    }
}
declare namespace Nabu {
    class InputNumber extends HTMLElement {
        static get observedAttributes(): string[];
        private _decimals;
        private _step;
        private _n;
        private _nElement;
        private _updateInterval;
        connectedCallback(): void;
        private _update;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        private _setValueProps;
        private _initialized;
        initialize(): void;
        setValue(n: number): void;
        onInputNCallback: (n: number) => void;
        private _onInputCallback;
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
    class InputVector3 extends HTMLElement {
        static get observedAttributes(): string[];
        private _useIJK;
        private _decimals;
        private _x;
        private _y;
        private _z;
        private _xElement;
        private _xLabelElement;
        private _yElement;
        private _yLabelElement;
        private _zElement;
        private _zLabelElement;
        private _updateInterval;
        targetXYZ: IVector3XYZValue;
        connectedCallback(): void;
        private _update;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        private _setLabelProps;
        private _setValueProps;
        private _initialized;
        initialize(): void;
        setValue(vec3: IVector3XYZValue): void;
        setValue(vec3: IVector3IJKValue): void;
        setValue(i: number, j: number, k: number): void;
        onInputXYZCallback: (xyz: IVector3XYZValue) => void;
        private _onInputCallback;
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
declare namespace Nabu {
    class OptionPage extends HTMLElement implements IPage {
        static get observedAttributes(): any[];
        private _loaded;
        private _shown;
        private _onLoad;
        get onLoad(): () => void;
        set onLoad(callback: () => void);
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        show(duration?: number): Promise<void>;
        hide(duration?: number): Promise<void>;
    }
}
declare namespace Nabu {
    class PanelElement extends HTMLElement {
        x: number;
        y: number;
        w: number;
        h: number;
        computedTop: number;
        computedLeft: number;
        fullLine: boolean;
        get top(): number;
        set top(v: number);
        get left(): number;
        set left(v: number);
    }
}
declare namespace Nabu {
    class PanelPage extends HTMLElement implements IPage {
        static get observedAttributes(): string[];
        private _loaded;
        private _shown;
        private _animateShowInterval;
        panels: PanelElement[];
        xCount: number;
        yCount: number;
        animLineHeight: number;
        animLineDir: number;
        private _onLoad;
        get onLoad(): () => void;
        set onLoad(callback: () => void);
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        show(duration?: number): Promise<void>;
        hide(duration?: number): Promise<void>;
        resize(): void;
    }
}
declare namespace Nabu {
    interface IPage {
        show(duration?: number): Promise<void>;
        hide(duration?: number): Promise<void>;
    }
    class Router {
        pages: IPage[];
        wait(duration: number): Promise<void>;
        findAllPages(): void;
        protected onFindAllPages(): void;
        initialize(): void;
        show(page: IPage, dontCloseOthers?: boolean): Promise<void>;
        hideAll(): Promise<void>;
        protected _currentHRef: string;
        private _update;
        protected onUpdate(): void;
        private _onHRefChange;
        protected onHRefChange(page: string): void;
    }
}
