namespace Nabu {
    
    export async function Wait(frames: number = 1): Promise<void> {
        return new Promise<void>(resolve => {
            let check = () => {
                if (frames <= 0) {
                    resolve();
                    return;
                }
                else {
                    frames--;
                    requestAnimationFrame(check);
                }
            }
            check();
        })
    }

    export async function NextFrame(): Promise<void> {
        return new Promise<void>(resolve => {
            requestAnimationFrame(() => {
                resolve();
            }) 
        });
    } 
}