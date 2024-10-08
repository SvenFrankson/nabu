// Part of this code by Andrey Sitnik and Ivan Solovev https://github.com/ai/easings.net

namespace Nabu {

    export class Easing {

        public static easeInSquare(x: number): number {
            return x * x;
        }

        public static easeOutSquare(x: number): number {
            return 1 - (1 - x) * (1 - x);
        }

        public static easeInCubic(x: number): number {
            return x * x * x;
        }

        public static easeOutCubic(x: number): number {
            return 1 - Math.pow(1 - x, 3);
        }

        public static easeInSine(x: number): number {
            return 1 - Math.cos((x * Math.PI) / 2);
        }

        public static easeOutSine(x: number): number {
            return Math.sin((x * Math.PI) / 2);
        }

        public static easeInOutSine(x: number): number {
            return - (Math.cos(Math.PI * x) - 1) / 2;
        }

        public static easeOutElastic(x: number): number {
            const c4 = (2 * Math.PI) / 3;
            
            return x === 0
            ? 0
            : x === 1
            ? 1
            : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
        }

        public static easeInOutBack(x: number): number {
            const c1 = 1.70158;
            const c2 = c1 * 1.525;
            
            return x < 0.5
            ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
            : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
        }

        public static invEaseInOutSine(x: number): number {
            return 1 - (Math.sin(x * Math.PI - Math.PI * 0.5) / 2 + 0.5);
        }

        public static easePendulum(x: number): number {
            let amplitude = Easing.invEaseInOutSine(x);
            amplitude = amplitude * amplitude;

            let v = Math.sin(8 * x * x * x * Math.PI - Math.PI / 2) * amplitude + 1;

            return v;
        }

        public static smooth010Sec(fps: number): number {
            if (fps < 13) {
                return 0;
            }
            return 1 - 1 / (0.08 * fps);
        }

        public static smooth025Sec(fps: number): number {
            if (fps < 8) {
                return 0;
            }
            return 1 - 1 / (0.13 * fps);
        }

        public static smooth05Sec(fps: number): number {
            if (fps < 4) {
                return 0;
            }
            return 1 - 1 / (0.25 * fps);
        }

        public static smooth1Sec(fps: number): number {
            if (fps < 2.25) {
                return 0;
            }
            return 1 - 1 / (0.45 * fps);
        }

        public static smooth2Sec(fps: number): number {
            if (fps < 1.2) {
                return 0;
            }
            return 1 - 1 / (0.9 * fps);
        }

        public static smooth3Sec(fps: number): number {
            if (fps < 1) {
                return 0;
            }
            return 1 - 1 / (1.35 * fps);
        }

        public static smoothNSec(fps: number, n: number): number {
            if (!isFinite(fps)) {
                return 0;
            }
            if (n === 0) {
                return 0;
            }
            if (fps < 1) {
                return 0;
            }
            return 1 - 1 / (n * 0.45 * fps);
        }
    }
}