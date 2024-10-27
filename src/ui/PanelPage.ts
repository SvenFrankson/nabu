namespace Nabu {
    
    export class PanelPage extends HTMLElement implements IPage {
        public static get observedAttributes() {
            return ["file", "anim-line-height", "anim-line-dir"];
        }

        private _loaded: boolean = false;
        public get loaded(): boolean {
            return this._loaded;
        }
        private _shown: boolean = false;
        public get shown(): boolean {
            return this._shown;
        }
        private _animateShowInterval: number;

        public panels: PanelElement[] = [];
        public xCount: number = 1;
        public yCount: number = 1;
        public animLineHeight: number = 1;
        public animLineDir: number = 1;

        private _onLoad: () => void;
        public get onLoad(): () => void {
            return this._onLoad;
        }
        public set onLoad(callback: () => void) {
            this._onLoad = callback;
            if (this._loaded) {
                this._onLoad();
            }
        }

        public async waitLoaded(): Promise<void> {
            return new Promise<void>(resolve => {
                let wait = () => {
                    if (this._loaded) {
                        resolve();
                    }
                    else {
                        requestAnimationFrame(wait);
                    }
                }
                wait();
            })
        }
        
        public connectedCallback(): void {
            let file = this.getAttribute("file");
            if (file) {
                this.attributeChangedCallback("file", "", file);
            }
        }

        public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            if (name === "file") {
                if (this.isConnected) {
                    const xhttp = new XMLHttpRequest();
                    xhttp.onload = () => {
                        this.innerHTML = xhttp.responseText;
                        this.style.position = "fixed";
                        this.style.zIndex = "10";
                        this._shown = false;
                        this.resize();
                        this.hide(0);
                        this._loaded = true;
                        if (this._onLoad) {
                            this._onLoad();
                        }
                    };
                    xhttp.open("GET", newValue);
                    xhttp.send();
                }
            } else if (name === "anim-line-height") {
                let v = parseInt(newValue);
                if (v > 0) {
                    this.animLineHeight = v;
                }
            } else if (name === "anim-line-dir") {
                let v = parseInt(newValue);
                if (v === -1 || v === 1) {
                    this.animLineDir = v;
                }
            }
        }

        private _t0: number = 0;
        private _duration: number = 0;
        private _outOfScreenLeft: number = 0;
        private _onNextAutoStoppedUpdateDone: () => void;
        public autoStoppedUpdate = () => {
            let t = performance.now() / 1000 - this._t0;
            if (this._shown) {
                if (t >= this._duration) {
                    for (let i = 0; i < this.panels.length; i++) {
                        let panel = this.panels[i];
                        panel.left = panel.computedLeft;
                        panel.style.opacity = "1";
                    }
                    if (this._onNextAutoStoppedUpdateDone) {
                        this._onNextAutoStoppedUpdateDone();
                    }
                }
                else {
                    let f = t / this._duration;
                    for (let i = 0; i < this.panels.length; i++) {
                        let panel = this.panels[i];
                        let targetLeft = this._outOfScreenLeft * this.animLineDir;
                        if (Math.floor(panel.y / this.animLineHeight) % 2 != Math.floor(this.yCount / this.animLineHeight) % 2) {
                            targetLeft = - this._outOfScreenLeft * this.animLineDir;
                        }
                        panel.left = (1 - f) * targetLeft + panel.computedLeft;
                        panel.style.opacity = f.toFixed(3);
                    }
                    requestAnimationFrame(this.autoStoppedUpdate);
                }
            }
            else {
                let t = performance.now() / 1000 - this._t0;
                if (t >= this._duration) {
                    for (let i = 0; i < this.panels.length; i++) {
                        let panel = this.panels[i];
                        let targetLeft = this._outOfScreenLeft * this.animLineDir;
                        if (Math.floor(panel.y / this.animLineHeight) % 2 != Math.floor(this.yCount / this.animLineHeight) % 2) {
                            targetLeft = - this._outOfScreenLeft * this.animLineDir;
                        }
                        panel.left = targetLeft + panel.computedLeft;
                        panel.style.display = "none";
                        panel.style.opacity = "0";
                    }
                    if (this._onNextAutoStoppedUpdateDone) {
                        this._onNextAutoStoppedUpdateDone();
                    }
                }
                else {
                    let f = t / this._duration;
                    for (let i = 0; i < this.panels.length; i++) {
                        let panel = this.panels[i];
                        let targetLeft = this._outOfScreenLeft * this.animLineDir;
                        if (Math.floor(panel.y / this.animLineHeight) % 2 != Math.floor(this.yCount / this.animLineHeight) % 2) {
                            targetLeft = - this._outOfScreenLeft * this.animLineDir;
                        }
                        panel.left = f * targetLeft + panel.computedLeft;
                        panel.style.opacity = (1 - f).toFixed(3);
                    }
                    requestAnimationFrame(this.autoStoppedUpdate);
                }
            }
        }

        public async show(duration: number = 1): Promise<void> {
            return new Promise<void>((resolve) => {
                if (!this._shown) {
                    this._shown = true;
                    this._outOfScreenLeft = 1.0 * window.innerWidth;
                    for (let i = 0; i < this.panels.length; i++) {
                        let panel = this.panels[i];
                        let targetLeft = this._outOfScreenLeft * this.animLineDir;
                        if (Math.floor(panel.y / this.animLineHeight) % 2 != Math.floor(this.yCount / this.animLineHeight) % 2) {
                            targetLeft = - this._outOfScreenLeft * this.animLineDir;
                        }
                        panel.left = targetLeft + panel.computedLeft;
                        panel.style.display = "block";
                        panel.style.opacity = "0";
                    }

                    this._t0 = performance.now() / 1000;
                    this._duration = duration;
                    this._onNextAutoStoppedUpdateDone = resolve;
                    this.autoStoppedUpdate();
                }
            });
        }

        public async hide(duration: number = 1): Promise<void> {
            if (duration === 0) {
                this._shown = false;
                let outOfScreenLeft = 1.0 * window.innerWidth;
                for (let i = 0; i < this.panels.length; i++) {
                    let panel = this.panels[i];
                    panel.left = outOfScreenLeft + panel.computedLeft;
                    panel.style.display = "none";
                    panel.style.opacity = "0";
                }
            }
            else {
                return new Promise<void>((resolve) => {
                    if (this._shown) {
                        this._shown = false;
                        this._outOfScreenLeft = 1.0 * window.innerWidth;
                        for (let i = 0; i < this.panels.length; i++) {
                            let panel = this.panels[i];
                            let targetLeft = this._outOfScreenLeft * this.animLineDir;
                            if (Math.floor(panel.y / this.animLineHeight) % 2 != Math.floor(this.yCount / this.animLineHeight) % 2) {
                                targetLeft = -this._outOfScreenLeft * this.animLineDir;
                            }
                            panel.left = targetLeft + panel.computedLeft;
                            panel.style.display = "block";
                            panel.style.opacity = "1";
                        }

                        this._t0 = performance.now() / 1000;
                        this._duration = duration;
                        this._onNextAutoStoppedUpdateDone = resolve;
                        this.autoStoppedUpdate();
                    }
                });
            }
        }

        public resize(): void {
            let requestedTileCount = 0;
            let requestedFullLines = 0;
            this.panels = [];
            let elements = this.querySelectorAll("panel-element");
            for (let i = 0; i < elements.length; i++) {
                let panel = elements[i] as PanelElement;
                this.panels[i] = panel;
                panel.h = parseInt(panel.getAttribute("h"));
                if (panel.getAttribute("w") === "line") {
                    panel.fullLine = true;
                    requestedFullLines++;
                }
                else {
                    panel.w = parseInt(panel.getAttribute("w"));
                    let area = panel.w * panel.h;
                    requestedTileCount += area;
                }
            }

            let rect = this.getBoundingClientRect();
            let containerW = rect.width;
            let containerH = rect.height;

            let min = 0;
            let max = 30;
            let ok = false;
            let emptyLinesBottom = 0;
            let emptyColumnsRight = 0;
            while (!ok) {
                ok = true;
                min++;
                if (min > max) {
                    console.log("panelpage fail")
                    return;
                }
                let bestValue: number = 0;
                for (let xC = min; xC <= max; xC++) {
                    for (let yC = min; yC <= max; yC++) {
                        let count = xC * yC;
                        if (count >= requestedTileCount) {
                            let w = containerW / xC;
                            let h = containerH / (yC + requestedFullLines);
                            let area = w * h;
                            let squareness = Math.min(w / h, h / w);
                            let value = area * squareness;
                            if (value > bestValue) {
                                this.xCount = xC;
                                this.yCount = yC + requestedFullLines;
                                bestValue = value;
                            }
                        }
                    }
                }

                let grid: boolean[][] = [];
                for (let y = 0; y <= this.yCount; y++) {
                    grid[y] = [];
                    for (let x = 0; x <= this.xCount; x++) {
                        grid[y][x] = x < this.xCount && y < this.yCount;
                    }
                }
                for (let n = 0; n < this.panels.length; n++) {
                    let panel = this.panels[n] as PanelElement;
                    panel.x = -1;
                    panel.y = -1;
                    if (panel.fullLine) {
                        panel.w = this.xCount;
                    }

                    for (let line = 0; line < this.yCount && panel.x === -1; line++) {
                        for (let col = 0; col < this.xCount && panel.x === -1; col++) {
                            let fit = true;
                            for (let x = 0; x < panel.w; x++) {
                                for (let y = 0; y < panel.h; y++) {
                                    fit = fit && grid[line + y][col + x];
                                }
                            }
                            if (fit) {
                                panel.x = col;
                                panel.y = line;
                                for (let x = 0; x < panel.w; x++) {
                                    for (let y = 0; y < panel.h; y++) {
                                        grid[line + y][col + x] = false;
                                    }
                                }
                            }
                        }
                    }
                    if (panel.x === -1) {
                        ok = false;
                    }
                }
                if (ok) {
                    let empty = true;
                    emptyLinesBottom = 0;
                    for (let y = this.yCount - 1; y > 0 && empty; y--) {
                        for (let x = 0; x < this.xCount && empty; x++) {
                            if (!grid[y][x]) {
                                empty = false;
                            }
                        }
                        if (empty) {
                            emptyLinesBottom++;
                        }
                    }

                    empty = true;
                    emptyColumnsRight = 0;
                    for (let x = this.xCount - 1; x > 0 && empty; x--) {
                        for (let y = 0; y < this.yCount && empty; y++) {
                            let fullLinePanel = this.panels.find(panel => { 
                                return (y >= panel.y && y < panel.y + panel.h) && panel.fullLine
                            });
                            if (!fullLinePanel) {
                                if (!grid[y][x]) {
                                    empty = false;
                                }
                            }
                        }
                        if (empty) {
                            emptyColumnsRight++;
                        }
                    }
                }
            }

            let tileW = containerW / this.xCount;
            let tileH = containerH / this.yCount;
            let m = 12;

            for (let i = 0; i < this.panels.length; i++) {
                let panel = this.panels[i];
                if (panel.fullLine) {
                    panel.w = this.xCount;
                }
                panel.style.width = (panel.w * tileW - 2 * m).toFixed(0) + "px";
                panel.style.height = (panel.h * tileH - 2 * m).toFixed(0) + "px";
                panel.style.position = "absolute";
                panel.computedLeft = panel.x * tileW;
                if (!panel.fullLine) {
                    panel.computedLeft += m + emptyColumnsRight * 0.5 * tileW;
                }
                panel.computedTop = panel.y * tileH + m + emptyLinesBottom * 0.5 * tileH;
                if (panel.style.display != "none") {
                    panel.style.left = panel.computedLeft.toFixed(0) + "px";
                }
                panel.style.top = panel.computedTop.toFixed(0) + "px";
            }
        }
    }

    customElements.define("panel-page", PanelPage);
}
