namespace Nabu {
    
    export class InputManager {

        public static DeadZoneAxis(axisValue: number, threshold: number = 0.1): number {
            if (Math.abs(axisValue) > threshold) {
                return (axisValue - threshold * Math.sign(axisValue)) / (1 - threshold);
            }
            return 0;
        }

        public temporaryNoPointerLock: boolean = false;
        public isPointerLocked: boolean = false;
        public isPointerDown: boolean = false;

        public padButtonsMap: Map<number, number[]> = new Map<number, number[]>();
        public padButtonsDown: Nabu.UniqueList<number> = new Nabu.UniqueList<number>(); // If the physical button is pressed, its index is in this list.

        public keyboardInputMap: Map<string, number[]> = new Map<string, number[]>();

        public keyInputDown: Nabu.UniqueList<number> = new Nabu.UniqueList<number>();
        public keyDownListeners: ((k: number) => any)[] = [];
        public mappedKeyDownListeners: Map<number, (() => any)[]> = new Map<number, (() => any)[]>();
        public keyUpListeners: ((k: number) => any)[] = [];
        public mappedKeyUpListeners: Map<number, (() => any)[]> = new Map<number, (() => any)[]>();
        public deactivateAllKeyInputs: boolean = false;
        private isGamepadAllowed: boolean; 

        constructor(public canvas: HTMLCanvasElement, public configuration?: Configuration) {
            try {
                navigator.getGamepads();
                this.isGamepadAllowed = true;
            }
            catch {
                this.isGamepadAllowed = false;
            }
        }

        public initialize(): void {
            this.canvas.addEventListener("pointerdown", (ev: PointerEvent) => {
                this.isPointerDown = true;
                if (!this.temporaryNoPointerLock && (this.configuration && this.configuration.getValue("canLockPointer") === 1)) {
                    this.canvas.requestPointerLock();
                    this.isPointerLocked = true;
                }
            });
            this.canvas.addEventListener("pointerup", () => {
                this.isPointerDown = false;
            });
            document.addEventListener("pointerlockchange", () => {
                if ((document.pointerLockElement === this.canvas)) {
                    this.isPointerLocked = true;
                }
                else {
                    this.isPointerLocked = false;
                }
            });

            window.addEventListener("keydown", (e) => {
                let keyInputs = this.keyboardInputMap.get(e.code);
                if (keyInputs) {
                    keyInputs.forEach(keyInput => {
                        if (isFinite(keyInput)) {
                            this.doKeyInputDown(keyInput);
                        }
                    })
                }
            });
            window.addEventListener("keyup", (e) => {
                let keyInputs = this.keyboardInputMap.get(e.code);
                if (keyInputs) {
                    keyInputs.forEach(keyInput => {
                        if (isFinite(keyInput)) {
                            this.doKeyInputUp(keyInput);
                        }
                    })
                }
            });
        }

        public initializeInputs(configuration: Configuration): void {
            if (configuration) {
                configuration.configurationElements.forEach(confElement => {
                    if (confElement.type === ConfigurationElementType.Input) {
                        confElement.forceInit();
                    }
                })
            }
        }

        public update(): void {
            if (this.isGamepadAllowed) {
                let gamepads = navigator.getGamepads();
                let gamepad = gamepads[0];
                if (gamepad) {
                    let hasButtonsDown: boolean = this.padButtonsDown.length > 0;
                    for (let b = 0; b < gamepad.buttons.length; b++) {
                        let v = gamepad.buttons[b].pressed;
                        if (v) {
                            if (!this.padButtonsDown.contains(b)) {
                                this.padButtonsDown.push(b);
                                let keys: number[] = this.padButtonsMap.get(b);
                                if (keys) {
                                    keys.forEach(key => {
                                        if (isFinite(key)) {
                                            this.doKeyInputDown(key);
                                        }
                                    })
                                }
                            }
                        } else if (hasButtonsDown) {
                            if (this.padButtonsDown.contains(b)) {
                                this.padButtonsDown.remove(b);
                                let keys: number[] = this.padButtonsMap.get(b);
                                if (keys) {
                                    keys.forEach(key => {
                                        if (isFinite(key)) {
                                            this.doKeyInputUp(key);
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            }
        }

        private doKeyInputDown(keyInput: number): void {
            if (this.deactivateAllKeyInputs) {
                return;
            }
            this.keyInputDown.push(keyInput);
            for (let i = 0; i < this.keyDownListeners.length; i++) {
                this.keyDownListeners[i](keyInput);
            }
            let listeners = this.mappedKeyDownListeners.get(keyInput);
            if (listeners) {
                for (let i = 0; i < listeners.length; i++) {
                    listeners[i]();
                }
            }
        }

        private doKeyInputUp(keyInput: number): void {
            if (this.deactivateAllKeyInputs) {
                return;
            }
            this.keyInputDown.remove(keyInput);
            for (let i = 0; i < this.keyUpListeners.length; i++) {
                this.keyUpListeners[i](keyInput);
            }
            let listeners = this.mappedKeyUpListeners.get(keyInput);
            if (listeners) {
                for (let i = 0; i < listeners.length; i++) {
                    listeners[i]();
                }
            }
        }

        public mapInput(input: string, key: number): void {
            if (input.startsWith("GamepadBtn")) {
                let btnIndex = parseInt(input.replace("GamepadBtn", ""));
                let keyInputs: number[] = this.padButtonsMap.get(btnIndex);
                if (!keyInputs) {
                    keyInputs = [];
                    this.padButtonsMap.set(btnIndex, keyInputs);
                }
                keyInputs.push(key);
            } else {
                let keyInputs: number[] = this.keyboardInputMap.get(input);
                if (!keyInputs) {
                    keyInputs = [];
                    this.keyboardInputMap.set(input, keyInputs);
                }
                keyInputs.push(key);
            }
        }

        public unMapInput(input: string, key: number): void {
            if (input.startsWith("GamepadBtn")) {
                let btnIndex = parseInt(input.replace("GamepadBtn", ""));
                let keyInputs: number[] = this.padButtonsMap.get(btnIndex);
                if (keyInputs) {
                    let index = keyInputs.indexOf(key);
                    if (index > -1) {
                        keyInputs.splice(index, 1);
                    }
                    if (keyInputs.length === 0) {
                        this.padButtonsMap.delete(btnIndex);
                    }
                }
            } else {
                let keyInputs: number[] = this.keyboardInputMap.get(input);
                if (keyInputs) {
                    let index = keyInputs.indexOf(key);
                    if (index > -1) {
                        keyInputs.splice(index, 1);
                    }
                    if (keyInputs.length === 0) {
                        this.keyboardInputMap.delete(input);
                    }
                }
            }
        }

        /*
    public onTouchStart(): void {
        if (!this._firstTouchStartTriggered) {
            this.onFirstTouchStart();
        }
    }

    private _firstTouchStartTriggered: boolean = false;
    private onFirstTouchStart(): void {	
        let movePad = new PlayerInputMovePad(this.player);
        movePad.connectInput(true);
        
        let headPad = new PlayerInputHeadPad(this.player);
        headPad.connectInput(false);
        this._firstTouchStartTriggered = true;

        document.getElementById("touch-menu").style.display = "block";
        document.getElementById("touch-jump").style.display = "block";

        this.main.isTouch = true;
    }
    */

        public addKeyDownListener(callback: (k: number) => any): void {
            this.keyDownListeners.push(callback);
        }

        public addMappedKeyDownListener(k: number, callback: () => any): void {
            let listeners = this.mappedKeyDownListeners.get(k);
            if (listeners) {
                listeners.push(callback);
            } else {
                listeners = [callback];
                this.mappedKeyDownListeners.set(k, listeners);
            }
        }

        public removeKeyDownListener(callback: (k: number) => any): void {
            let i = this.keyDownListeners.indexOf(callback);
            if (i != -1) {
                this.keyDownListeners.splice(i, 1);
            }
        }

        public removeMappedKeyDownListener(k: number, callback: () => any): void {
            let listeners = this.mappedKeyDownListeners.get(k);
            if (listeners) {
                let i = listeners.indexOf(callback);
                if (i != -1) {
                    listeners.splice(i, 1);
                }
            }
        }

        public addKeyUpListener(callback: (k: number) => any): void {
            this.keyUpListeners.push(callback);
        }

        public addMappedKeyUpListener(k: number, callback: () => any): void {
            let listeners = this.mappedKeyUpListeners.get(k);
            if (listeners) {
                listeners.push(callback);
            } else {
                listeners = [callback];
                this.mappedKeyUpListeners.set(k, listeners);
            }
        }

        public removeKeyUpListener(callback: (k: number) => any): void {
            let i = this.keyUpListeners.indexOf(callback);
            if (i != -1) {
                this.keyUpListeners.splice(i, 1);
            }
        }

        public removeMappedKeyUpListener(k: number, callback: () => any): void {
            let listeners = this.mappedKeyUpListeners.get(k);
            if (listeners) {
                let i = listeners.indexOf(callback);
                if (i != -1) {
                    listeners.splice(i, 1);
                }
            }
        }

        public isKeyInputDown(keyInput: number): boolean {
            return this.keyInputDown.contains(keyInput);
        }
    }
}
