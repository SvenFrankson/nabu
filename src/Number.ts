namespace Nabu {
    
    var Pow2Values: number[] = [];
    for (let i = 0; i < 20; i++) {
        Pow2Values[i] = Math.pow(2, i);
    }
    
    export function Pow2(n: number): number {
        return Pow2Values[n];
    }

}