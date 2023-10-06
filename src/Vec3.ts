/// <reference path="../lib/babylon.d.ts"/>

namespace Nabu {
    
    export function IsFinite(v: BABYLON.Vector3): boolean {
        return isFinite(v.x) && isFinite(v.y) && isFinite(v.z);
    }
}