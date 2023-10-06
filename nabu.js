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
    function IsFinite(v) {
        return isFinite(v.x) && isFinite(v.y) && isFinite(v.z);
    }
    Nabu.IsFinite = IsFinite;
})(Nabu || (Nabu = {}));
