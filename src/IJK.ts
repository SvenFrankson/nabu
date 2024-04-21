namespace Nabu {

    export interface IJK {
        i: number;
        j: number;
        k: number;
    }

    export function IJK(i: number, j: number, k: number): IJK {
        return { i: i, j: j, k: k };
    }

    export function GetLineIJKsFromTo(from: Nabu.IJK, to: Nabu.IJK): Nabu.IJK[] {
        let iDist = Math.abs(from.i - to.i);
        let jDist = Math.abs(from.j - to.j);
        let kDist = Math.abs(from.k - to.k);

        let lineIJKs = [];

        if (iDist === 0 && jDist === 0 && kDist === 0) {
            lineIJKs = [IJK(from.i, from.j, from.k)];
        }
        else if (iDist >= jDist && iDist >= kDist) {
            if (from.i < to.i) {
                for (let ii = from.i; ii <= to.i; ii++) {
                    let f = (ii - from.i) / iDist;
                    let jj = Math.round((1 - f) * from.j + f * to.j);
                    let kk = Math.round((1 - f) * from.k + f * to.k);
                    lineIJKs.push(IJK(ii, jj, kk));
                }
            } else {
                for (let ii = to.i; ii <= from.i; ii++) {
                    let f = (ii - to.i) / iDist;
                    let jj = Math.round((1 - f) * to.j + f * from.j);
                    let kk = Math.round((1 - f) * to.k + f * from.k);
                    lineIJKs.push(IJK(ii, jj, kk));
                }
            }
        }
        else if (jDist >= iDist && jDist >= kDist) {
            if (from.j < to.j) {
                for (let jj = from.j; jj <= to.j; jj++) {
                    let f = (jj - from.j) / jDist;
                    let ii = Math.round((1 - f) * from.i + f * to.i);
                    let kk = Math.round((1 - f) * from.k + f * to.k);
                    lineIJKs.push(IJK(ii, jj, kk));
                }
            } else {
                for (let jj = to.j; jj <= from.j; jj++) {
                    let f = (jj - to.j) / jDist;
                    let ii = Math.round((1 - f) * to.i + f * from.i);
                    let kk = Math.round((1 - f) * to.k + f * from.k);
                    lineIJKs.push(IJK(ii, jj, kk));
                }
            }
        }
        else if (kDist >= iDist && kDist >= kDist) {
            if (from.k < to.k) {
                for (let kk = from.k; kk <= to.k; kk++) {
                    let f = (kk - from.k) / kDist;
                    let ii = Math.round((1 - f) * from.i + f * to.i);
                    let jj = Math.round((1 - f) * from.j + f * to.j);
                    lineIJKs.push(IJK(ii, jj, kk));
                }
            } else {
                for (let kk = to.k; kk <= from.k; kk++) {
                    let f = (kk - to.k) / kDist;
                    let ii = Math.round((1 - f) * to.i + f * from.i);
                    let jj = Math.round((1 - f) * to.j + f * from.j);
                    lineIJKs.push(IJK(ii, jj, kk));
                }
            }
        }
        return lineIJKs;
    }
}