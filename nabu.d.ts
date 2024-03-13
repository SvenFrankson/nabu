declare namespace Nabu {
    function Wait(frames?: number): Promise<void>;
    function NextFrame(): Promise<void>;
}
declare namespace Nabu {
    function Compress(data: Uint8Array): Uint8Array;
    function Decompress(data: Uint8Array): Uint8Array;
}
declare namespace Nabu {
    enum ConfigurationElementType {
        Boolean = 0,
        Number = 1,
        Enum = 2
    }
    interface IConfigurationElementValueProp {
        displayName?: string;
        min?: number;
        max?: number;
        step?: number;
        toString?: (v: number) => string;
    }
    class ConfigurationElement {
        property: string;
        type: ConfigurationElementType;
        value: number;
        prop?: IConfigurationElementValueProp;
        onChange?: (v: number) => void;
        constructor(property: string, type: ConfigurationElementType, value: number, prop?: IConfigurationElementValueProp, onChange?: (v: number) => void);
        forceInit(): void;
    }
    abstract class Configuration {
        configName: string;
        configurationElements: ConfigurationElement[];
        constructor(configName: string);
        initialize(): void;
        protected abstract _buildElementsArray(): void;
        getElement(property: string): ConfigurationElement;
        getValue(property: string): number;
        saveToLocalStorage(): void;
        serialize(): any;
        deserialize(data: any): void;
    }
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
    function RoundPow2(n: number): number;
    function Step(from: number, to: number, step: number): number;
    function StepAngle(from: number, to: number, step: number): number;
    function LerpAngle(from: number, to: number, t: number): number;
    function AngularDistance(from: number, to: number): number;
    function BicubicInterpolate(x: number, y: number, v00: number, v10: number, v20: number, v30: number, v01: number, v11: number, v21: number, v31: number, v02: number, v12: number, v22: number, v32: number, v03: number, v13: number, v23: number, v33: number): number;
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
    class Vector2 {
        x: number;
        y: number;
        static DistanceSquared(v1: Vector2, v2: Vector2): number;
        static Distance(v1: Vector2, v2: Vector2): number;
        static AverageToRef(ref: Vector2, ...vectors: Vector2[]): Vector2;
        static Average(...vectors: Vector2[]): Vector2;
        constructor(x?: number, y?: number);
        addInPlace(other: Vector2): Vector2;
        scaleInPlace(s: number): Vector2;
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
    class CellMap {
        private _cellMapGenerator;
        iMap: number;
        jMap: number;
        data: Uint8ClampedArray;
        min: number;
        max: number;
        lastUsageTime: number;
        constructor(_cellMapGenerator: CellMapGenerator, iMap: number, jMap: number);
        get(i: number, j: number): number;
    }
    class BiomeWeight {
        v1: number;
        w1: number;
        v2: number;
        w2: number;
        v3: number;
        w3: number;
        constructor(valueA: number, weightA: number, valueB?: number, weightB?: number, valueC?: number, weightC?: number);
    }
    class CellMapGenerator {
        seededMap: SeededMap;
        cellSize: number;
        pixelSize: number;
        static MAP_SIZE: number;
        voronoiDiagram: VoronoiDiagram;
        maxFrameTimeMS: number;
        maxCachedMaps: number;
        cellMaps: CellMap[];
        constructor(seededMap: SeededMap, cellSize: number, pixelSize?: number);
        getMap(IMap: number, JMap: number): CellMap;
        getValue(iGlobal: number, jGlobal: number): number;
        private kernel;
        getBiomeWeights(iGlobal: number, jGlobal: number): {
            v1: number;
            w1: number;
            v2?: number;
            w2?: number;
            v3?: number;
            w3?: number;
        };
        updateDetailedCache(): void;
        generateMapData(map: CellMap): void;
    }
}
declare namespace Nabu {
    class MasterSeed {
        static BaseSeed: Uint8ClampedArray;
        static GetFor(name: string): Uint8ClampedArray;
    }
}
declare namespace Nabu {
    class Point {
        map: PointsMap;
        i: number;
        j: number;
        value: number;
        iGlobal: number;
        jGlobal: number;
        constructor(map: PointsMap, i?: number, j?: number, value?: number);
    }
    class PointsMap {
        pointsMapGenerator: PointsMapGenerator;
        iMap: number;
        jMap: number;
        points: Point[];
        min: number;
        max: number;
        lastUsageTime: number;
        constructor(pointsMapGenerator: PointsMapGenerator, iMap: number, jMap: number);
    }
    class PointsMapGenerator {
        seededMap: SeededMap;
        static MAP_SIZE: number;
        maxFrameTimeMS: number;
        maxCachedMaps: number;
        pointsMaps: PointsMap[];
        constructor(seededMap: SeededMap);
        getPointsToRef(iGlobalMin: number, iGlobalMax: number, jGlobalMin: number, jGlobalMax: number, ref: Point[]): void;
        getMap(IMap: number, JMap: number): PointsMap;
        updateDetailedCache(): void;
        generateMapData(map: PointsMap): void;
    }
}
declare namespace Nabu {
    class SeedMap {
        name: string;
        size: number;
        _data: Uint8ClampedArray;
        constructor(name: string, size: number);
        getData(i: number, j: number): number;
        setData(i: number, j: number, v: number): void;
        randomFill(): void;
        fillFromBaseSeedMap(baseSeedMap: Uint8ClampedArray, n: number, IMap: number, JMap: number): void;
        fillFromPNG(url: string): Promise<void>;
        downloadAsPNG(): void;
    }
}
declare namespace Nabu {
    class SeededMap {
        N: number;
        size: number;
        debugBaseSeedMap: Uint8ClampedArray;
        seedMaps: SeedMap[][];
        primes: number[];
        constructor(N: number, size: number);
        static CreateFromMasterSeed(masterSeed: Uint8ClampedArray, N: number, size: number): SeededMap;
        static CreateWithRandomFill(N: number, size: number): SeededMap;
        getValue(i: number, j: number, d: number): number;
        downloadAsPNG(size: number, d?: number): void;
        downloadDebugBaseSeedAsPNG(): void;
    }
}
declare namespace Nabu {
    class TerrainMap {
        private _terrainMapGenerator;
        iMap: number;
        jMap: number;
        data: Uint8ClampedArray;
        min: number;
        max: number;
        lastUsageTime: number;
        constructor(_terrainMapGenerator: TerrainMapGenerator, iMap: number, jMap: number);
        get(i: number, j: number): number;
    }
    class TerrainMapGenerator {
        seededMap: SeededMap;
        static PERIODS_COUNT: number;
        static MAP_SIZE: number;
        static MEDIUM_MAP_PIXEL_SIZE: number;
        static LARGE_MAP_PIXEL_SIZE: number;
        maxFrameTimeMS: number;
        maxCachedMaps: number;
        detailedMaps: TerrainMap[];
        mediumMaps: TerrainMap[];
        largeMaps: TerrainMap[];
        periods: number[];
        constructor(seededMap: SeededMap, periods: number | number[]);
        getMap(IMap: number, JMap: number): Promise<TerrainMap>;
        updateDetailedCache(): void;
        getMediumMap(IMap: number, JMap: number): Promise<TerrainMap>;
        updateMediumedCache(): void;
        getLargeMap(IMap: number, JMap: number): Promise<TerrainMap>;
        updateLargedCache(): void;
        generateMapData(map: TerrainMap, pixelSize?: number): Promise<void>;
        downloadAsPNG(IMap: number, JMap: number, size?: number, range?: number): Promise<void>;
    }
}
declare namespace Nabu {
    class VoronoiCell {
        diagram: VoronoiDiagram;
        i: number;
        j: number;
        center: Vector2;
        polygon: Vector2[];
        value: number;
        edges: UniqueList<VoronoiCell>;
        constructor(diagram: VoronoiDiagram, i: number, j: number);
        getColor(): string;
        getPolygon(): Vector2[];
        connect(other: VoronoiCell): void;
        isConnectedTo(other: VoronoiCell): boolean;
    }
    class VoronoiDiagram {
        cellSize: number;
        cellSpread: number;
        static colors: string[];
        cells: VoronoiCell[][];
        constructor(cellSize: number, cellSpread?: number);
        getCell(i: number, j: number): VoronoiCell;
        getValues(size: number, iMap?: number, jMap?: number): Uint8ClampedArray;
        downloadAsPNG(size: number): Promise<void>;
        downloadAsSirenPNG(size: number): Promise<void>;
    }
}
declare namespace Nabu {
    class OptionPage extends HTMLElement implements IPage {
        static get observedAttributes(): any[];
        private _loaded;
        private _shown;
        configuration: Configuration;
        private _title;
        private _containerFrame;
        private _container;
        private _backButton;
        private _onLoad;
        get onLoad(): () => void;
        set onLoad(callback: () => void);
        connectedCallback(): void;
        attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
        show(duration?: number): Promise<void>;
        hide(duration?: number): Promise<void>;
        setConfiguration(configuration: Configuration): void;
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
