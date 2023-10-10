/// <reference path="lib/babylon.d.ts" />
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
    function Pow2(n: number): number;
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
    function IsFinite(v: BABYLON.Vector3): boolean;
    function ProjectPerpendicularAtToRef(v: BABYLON.Vector3, at: BABYLON.Vector3, out: BABYLON.Vector3): BABYLON.Vector3;
    function ProjectPerpendicularAt(v: BABYLON.Vector3, at: BABYLON.Vector3): BABYLON.Vector3;
    function Angle(from: BABYLON.Vector3, to: BABYLON.Vector3): number;
    function AngleFromToAround(from: BABYLON.Vector3, to: BABYLON.Vector3, around: BABYLON.Vector3): number;
    function StepToRef(from: BABYLON.Vector3, to: BABYLON.Vector3, step: number, ref: BABYLON.Vector3): BABYLON.Vector3;
    function Step(from: BABYLON.Vector3, to: BABYLON.Vector3, step: number): BABYLON.Vector3;
}
