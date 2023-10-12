namespace Nabu {
    
    var Pow2Values: number[] = [];
    for (let i = 0; i < 20; i++) {
        Pow2Values[i] = Math.pow(2, i);
    }
    
    export function Pow2(n: number): number {
        return Pow2Values[n];
    }

    export function RoundPow2Exponent(n: number): number {
        let exponent: number = 0;
        while (Pow2Values[exponent] < n) {
            exponent++;
        }
        return exponent;
    }

    export function CeilPow2Exponent(n: number): number {
        let exponent: number = 0;
        while (Pow2Values[exponent] < n) {
            exponent++;
        }
        return exponent + 1;
    }
}