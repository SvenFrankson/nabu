namespace Nabu {
    
    export interface IPage {
        show(duration?: number): Promise<void>;
        hide(duration?: number): Promise<void>;
    }

    export class Router {
        public pages: IPage[] = [];

        public homePage: PanelPage;
        public challengePage: PanelPage;

        public async wait(duration: number): Promise<void> {
            return new Promise<void>((resolve) => {
                setTimeout(resolve, duration * 1000);
            });
        }

        public findAllPages(): void {
            this.pages = [];
            let mainMenus = document.querySelectorAll("panel-page");
            mainMenus.forEach((mainMenu) => {
                if (mainMenu instanceof PanelPage) {
                    this.pages.push(mainMenu);
                }
            });
        }

        public initialize(): void {
            this.findAllPages();

            // Set all pages here
            this.homePage = document.getElementById("home-page") as PanelPage;
            this.challengePage = document.getElementById("challenge-page") as PanelPage;

            setInterval(this._update, 30);
        }

        public async show(page: IPage, dontCloseOthers?: boolean): Promise<void> {
            this.findAllPages();

            if (!dontCloseOthers) {
                for (let i = 0; i < this.pages.length; i++) {
                    this.pages[i].hide(1);
                }
            }
            await page.show(1);
        }

        private _currentHRef: string;
        private _update = () => {
            let href = window.location.href;
            if (href != this._currentHRef) {
                this._currentHRef = href;
                this._onHRefChange();
            }
        };

        private _onHRefChange = async () => {
            let split = this._currentHRef.split("/");
            let page = split[split.length - 1];
            if (page.endsWith("#challenge")) {
                this.show(this.challengePage);
            } else if (page.endsWith("#home") || true) {
                this.show(this.homePage);
            }
        };
    }
}
