namespace Nabu {
    
    var Pow2Values: number[] = [];
    for (let i = 0; i < 20; i++) {
        Pow2Values[i] = Math.pow(2, i);
    }
    
    export function Pow2(n: number): number {
        return Pow2Values[n];
    }

    export function FloorPow2Exponent(n: number): number {
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

    export function Step(from: number, to: number, step: number): number {
        if (Math.abs(from - to) <= step) {
            return to;
        }
        if (to < from) {
            step *= - 1;
        }
        return from + step;
    }

    export function StepAngle(from: number, to: number, step: number): number {
        while (from < 0) {
            from += 2 * Math.PI;
        }
        while (to < 0) {
            to += 2 * Math.PI;
        }
        while(from >= 2 * Math.PI) {
            from -= 2 * Math.PI;
        }
        while(to >= 2 * Math.PI) {
            to -= 2 * Math.PI;
        }

        if (Math.abs(from - to) <= step) {
            return to;
        }
        if (to < from) {
            step *= - 1;
        }
        if (Math.abs(from - to) > Math.PI) {
            step *= - 1;
        }
        return from + step;
    }

    export function LerpAngle(from: number, to: number, t: number): number {
        while (from < 0) {
            from += 2 * Math.PI;
        }
        while (to < 0) {
            to += 2 * Math.PI;
        }
        while(from >= 2 * Math.PI) {
            from -= 2 * Math.PI;
        }
        while(to >= 2 * Math.PI) {
            to -= 2 * Math.PI;
        }

        if (Math.abs(from - to) > Math.PI) {
            if (from > Math.PI) {
                from -= 2 * Math.PI;
            }
            else {
                to -= 2 * Math.PI;
            }
        }
        return from * (1 - t) + to * t;
    }

    export function AngularDistance(from: number, to: number): number {
        while (from < 0) {
            from += 2 * Math.PI;
        }
        while (to < 0) {
            to += 2 * Math.PI;
        }
        while(from >= 2 * Math.PI) {
            from -= 2 * Math.PI;
        }
        while(to >= 2 * Math.PI) {
            to -= 2 * Math.PI;
        }

        let d = Math.abs(from - to);
        if (d > Math.PI) {
            d *= - 1;
        }
        if (to < from) {
            d *= - 1;
        }
        return d;
    }
}