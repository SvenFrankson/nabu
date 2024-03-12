namespace Nabu {

    export class Vector2 {

        public static DistanceSquared(v1: Vector2, v2: Vector2) {
            return (v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y);
        }

        public static Distance(v1: Vector2, v2: Vector2) {
            return Math.sqrt(Vector2.DistanceSquared(v1, v2));
        }

        public static AverageToRef(ref: Vector2, ...vectors: Vector2[]): Vector2 {
            let l = vectors.length;
            if (l >= 1) {
                ref.x = 0;
                ref.y = 0;
                for (let i = 0; i < vectors.length; i++) {
                    ref.addInPlace(vectors[i]);
                }
                ref.scaleInPlace(1 / l);
            }

            return ref;
        }

        public static Average(...vectors: Vector2[]): Vector2 {
            let v = new Vector2();
            Vector2.AverageToRef(v, ...vectors);
            return v;
        }

        constructor(public x: number = 0, public y: number = 0) {
            
        }

        public addInPlace(other: Vector2): Vector2 {
            this.x += other.x;
            this.y += other.y;
            return this;
        }

        public scaleInPlace(s: number): Vector2 {
            this.x *= s;
            this.y *= s;
            return this;
        }
    }
}