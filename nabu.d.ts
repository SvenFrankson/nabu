/// <reference path="lib/babylon.d.ts" />
declare namespace Nabu {
    function Pow2(n: number): number;
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
