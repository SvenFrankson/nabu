namespace Nabu {
    export class MasterSeed {
        public static BaseSeed: Uint8ClampedArray = new Uint8ClampedArray([
            161, 230, 19, 231, 240, 195, 189, 19, 206, 120, 135, 15, 5, 43, 129, 94, 184, 97, 143, 120, 3, 147, 12, 42, 53, 108, 200, 121, 36, 175, 175, 36, 131, 119, 196, 9, 35, 226, 215, 169, 210, 224, 198, 104, 19, 224, 186, 209, 223, 96, 94, 247, 36, 203, 87, 7, 229, 242, 118, 209, 75, 181, 82, 140, 50, 213, 202, 165, 204, 72, 159, 57, 159, 142, 228, 187, 103, 187, 68, 219, 102, 108, 149, 162,
            57, 124, 214, 51, 18, 236, 184, 139, 79, 153, 42, 36, 162, 110, 90, 231, 68, 0, 202, 80, 243, 85, 157, 63, 55, 42, 169, 234, 238, 250, 203, 118, 41, 15, 198, 46, 250, 147, 195, 174, 15, 150, 162, 86, 205, 107, 185, 60, 57, 28, 144, 217, 216, 7, 74, 252, 245, 79, 31, 10, 40, 70, 113, 35, 43, 206, 116, 52, 179, 173, 220, 36, 143, 135, 114, 203, 118, 173, 107, 245, 76, 183, 242, 220, 158,
            133, 157, 215, 57, 147, 70, 148, 138, 234, 47, 195, 90, 30, 29, 106, 13, 68, 123, 161, 179, 162, 46, 159, 84, 129, 168, 254, 210, 18, 74, 223, 97, 240, 234, 46, 49, 46, 164, 217, 27, 152, 157,
        ]);

        public static GetFor(name: string): Uint8ClampedArray {
            let masterSeed = new Uint8ClampedArray(MasterSeed.BaseSeed);
            for (let i = 0; i < masterSeed.length; i++) {
                masterSeed[i] = masterSeed[i] ^ name.charCodeAt(i % name.length);
            }

            return masterSeed;
        }
    }
}
