namespace Nabu {
    
    export interface IPage {
        show(duration?: number): Promise<void>;
        hide(duration?: number): Promise<void>;
    }

    export class Router {
        public pages: IPage[] = [];

        public async wait(duration: number): Promise<void> {
            return new Promise<void>((resolve) => {
                setTimeout(resolve, duration * 1000);
            });
        }

        public findAllPages(): void {
            this.pages = [];
            let panelPages = document.querySelectorAll("panel-page");
            panelPages.forEach((panelPage) => {
                if (panelPage instanceof PanelPage) {
                    this.pages.push(panelPage);
                }
            });
            let optionsPages = document.querySelectorAll("option-page");
            optionsPages.forEach((optionPage) => {
                if (optionPage instanceof OptionPage) {
                    this.pages.push(optionPage);
                }
            });
            let defaultPages = document.querySelectorAll("default-page");
            defaultPages.forEach((defaultPage) => {
                if (defaultPage instanceof DefaultPage) {
                    this.pages.push(defaultPage);
                }
            });
            this.onFindAllPages();
        }

        protected onFindAllPages(): void {

        }

        public initialize(): void {
            this.findAllPages();
            this._update();
            setInterval(this._update, 30);
        }

        public async show(page: IPage, dontCloseOthers?: boolean): Promise<void> {
            this.findAllPages();

            if (!dontCloseOthers) {
                this.hideAll();
            }
            await page.show(1);
        }

        public async hideAll(): Promise<void> {
            for (let i = 0; i < this.pages.length; i++) {
                this.pages[i].hide(1);
            }
            return new Promise<void>(resolve => {
                setTimeout(resolve, 1000);
            });
        }

        protected _currentHRef: string;
        private _update = () => {
            let href = window.location.href;
            if (href != this._currentHRef) {
                console.log("origin = " + location.origin);
                let previousHRef = this._currentHRef;
                this._currentHRef = href;
                this._onHRefChange(previousHRef);
            }
            this.onUpdate();
        };

        protected onUpdate(): void {

        }

        private _onHRefChange = async (previousHRef: string) => {
            let split = this._currentHRef.split("/");
            let page = split[split.length - 1];
            let splitPage = page.split("#");
            page = "#" + splitPage[splitPage.length - 1];
            
            let previousPage: string;
            if (previousHRef) {
                let previousSplit = previousHRef.split("/");
                if (previousSplit.length > 0) {
                    previousPage = previousSplit[split.length - 1];
                    let previousSplitPage = previousPage.split("#");
                    if (previousSplitPage.length > 0) {
                        previousPage = "#" + previousSplitPage[previousSplitPage.length - 1];
                    }
                }
            }
            
            this.onHRefChange(page, previousPage);
        };

        protected onHRefChange(page: string, previousPage?: string): void {
            
        }
    }
}
