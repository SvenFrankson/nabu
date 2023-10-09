var Nabu;
(function (Nabu) {
    var Pow2Values = [];
    for (let i = 0; i < 20; i++) {
        Pow2Values[i] = Math.pow(2, i);
    }
    function Pow2(n) {
        return Pow2Values[n];
    }
    Nabu.Pow2 = Pow2;
})(Nabu || (Nabu = {}));
/// <reference path="../lib/babylon.d.ts"/>
var Nabu;
(function (Nabu) {
    var TmpVec3 = [
        BABYLON.Vector3.Zero(),
        BABYLON.Vector3.Zero(),
        BABYLON.Vector3.Zero()
    ];
    function IsFinite(v) {
        return isFinite(v.x) && isFinite(v.y) && isFinite(v.z);
    }
    Nabu.IsFinite = IsFinite;
    function ProjectPerpendicularAtToRef(v, at, out) {
        let k = (v.x * at.x + v.y * at.y + v.z * at.z);
        k = k / (at.x * at.x + at.y * at.y + at.z * at.z);
        out.copyFrom(v);
        out.subtractInPlace(at.multiplyByFloats(k, k, k));
        return out;
    }
    Nabu.ProjectPerpendicularAtToRef = ProjectPerpendicularAtToRef;
    function ProjectPerpendicularAt(v, at) {
        let p = BABYLON.Vector3.Zero();
        ProjectPerpendicularAtToRef(v, at, p);
        return p;
    }
    Nabu.ProjectPerpendicularAt = ProjectPerpendicularAt;
    function Angle(from, to) {
        let pFrom = TmpVec3[0].copyFrom(from).normalize();
        let pTo = TmpVec3[1].copyFrom(from).normalize();
        let angle = Math.acos(BABYLON.Vector3.Dot(pFrom, pTo));
        return angle;
    }
    Nabu.Angle = Angle;
    function AngleFromToAround(from, to, around) {
        let pFrom = TmpVec3[0];
        let pTo = TmpVec3[1];
        ProjectPerpendicularAtToRef(from, around, pFrom).normalize();
        ProjectPerpendicularAtToRef(to, around, pTo).normalize();
        let dot = BABYLON.Vector3.Dot(pFrom, pTo);
        dot = Math.min(Math.max(dot, -1), 1);
        let angle = Math.acos(dot);
        if (angle > Math.PI / 360 / 60) {
            BABYLON.Vector3.CrossToRef(pFrom, pTo, TmpVec3[2]);
            if (BABYLON.Vector3.Dot(TmpVec3[2], around) < 0) {
                angle = -angle;
            }
        }
        return angle;
    }
    Nabu.AngleFromToAround = AngleFromToAround;
    function StepToRef(from, to, step, ref) {
        from = TmpVec3[0].copyFrom(from);
        let sqrStep = step * step;
        if (BABYLON.Vector3.DistanceSquared(from, to) < sqrStep) {
            ref.copyFrom(to);
        }
        else {
            ref.copyFrom(to).subtractInPlace(from).normalize().scaleInPlace(step).addInPlace(from);
        }
        return ref;
    }
    Nabu.StepToRef = StepToRef;
    function Step(from, to, step) {
        let v = BABYLON.Vector3.Zero();
        StepToRef(from, to, step, v);
        return v;
    }
    Nabu.Step = Step;
})(Nabu || (Nabu = {}));
