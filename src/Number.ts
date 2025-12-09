namespace Nabu {
    
    var Pow2Values: number[] = [];
    for (let i = 0; i < 20; i++) {
        Pow2Values[i] = Math.pow(2, i);
    }

    export function MinMax(n: number, min: number, max: number): number {
        return Math.min(Math.max(n, min), max);
    }

    export function RoundTowardZero(n: number): number {
        if (n < 0) {
            return Math.ceil(n);
        }
        return Math.floor(n);
    }

    export function In0_2PIRange(angle: number): number {
        while (angle < 0) {
            angle += 2 * Math.PI;
        }
        while (angle >= 2 * Math.PI) {
            angle -= 2 * Math.PI;
        }
        return angle;
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

    export function RoundPow2(n: number): number {
        let floor = Nabu.Pow2(Nabu.FloorPow2Exponent(n));
        let ceil = Nabu.Pow2(Nabu.CeilPow2Exponent(n));
        if (Math.abs(floor - n) <= Math.abs(ceil - n)) {
            return floor;
        } else {
            return ceil;
        }
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

    export function AbsoluteAngularDistance(from: number, to: number): number {
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
            d = 2 * Math.PI - d;
        }
        return d;
    }

    function TERP(t: number, a: number, b: number, c: number, d: number): number {
        return 0.5 * (c - a + (2.0*a - 5.0*b + 4.0*c - d + (3.0*(b - c) + d - a)*t)*t)*t + b;
    }

    export function BicubicInterpolate(
        x: number,
        y: number,
        v00: number,
        v10: number,
        v20: number,
        v30: number,
        v01: number,
        v11: number,
        v21: number,
        v31: number,
        v02: number,
        v12: number,
        v22: number,
        v32: number,
        v03: number,
        v13: number,
        v23: number,
        v33: number
    ) {
        let i0 = TERP(x, v00, v10, v20, v30);
        let i1 = TERP(x, v01, v11, v21, v31);
        let i2 = TERP(x, v02, v12, v22, v32);
        let i3 = TERP(x, v03, v13, v23, v33);
        
        return TERP(y, i0, i1, i2, i3);
    }
}