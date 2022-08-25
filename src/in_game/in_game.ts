import { AppWindow } from '../app-window';
import { kWindowNames } from '../consts';
import { OpticalImplant } from '../implant';

const OI = new OpticalImplant();

export const InGameWindowPosition = {
    x: 230, y: 385,
};

// The window displayed in-game while a game is running.
// It listens to all info events and to the game events listed in the consts.ts file
// and writes them to the relevant log using <pre> tags.
// The window also sets up Ctrl+F as the minimize/restore hotkey.
// Like the background window, it also implements the Singleton design pattern.
class InGame extends AppWindow {
    private static _instance: InGame;
    private _moduleContainer: HTMLElement;
    private _opticalImplant: OpticalImplant;

    private constructor() {
        super(kWindowNames.inGame);

        this._opticalImplant = OI;

        this._moduleContainer = document.getElementById('app');

        this.prepareWindow();
        this.prepareListeners();
    }

    private prepareListeners = () => {
        overwolf.games.inputTracking.onKeyUp.addListener((event) => {
            // F button
            if (event.key !== '70') {
                return;
            }

            this.hackingListener();
        });
    };

    private prepareWindow = () => {
        overwolf.windows.changeSize(this.currentWindowId, 845, 900);
        overwolf.windows.changePosition(this.currentWindowId, InGameWindowPosition.x, InGameWindowPosition.y);
        this.currWindow.minimize();
        this.hidePreloader();
    };

    private showPreloader() {
        overwolf.windows.restore(kWindowNames.glitch);
    }

    private hidePreloader() {
        overwolf.windows.hide(kWindowNames.glitch);
    }

    private hackingListener = () => {
        setTimeout(async () => {
            const isHackAvailable = await this._opticalImplant.isHackingEnabled();

            console.log('isHackAvailable', isHackAvailable);

            if (!isHackAvailable) {
                return;
            }

            await this.showPreloader();

            this.hackTerminal();
        }, 4000);
    };

    private finishHackingListener = () => {
        setTimeout(async () => {
            if (await this._opticalImplant.isHackingEnabled()) {
                return;
            }

            this.showPreloader();

            overwolf.games.inputTracking.onMouseDown.removeListener(this.finishHackingListener);
            overwolf.games.inputTracking.onKeyUp.removeListener(this.finishHackingListener);

            setTimeout(() => {
                this.hidePreloader();
            }, 1000);

            await this.currWindow.minimize();
        }, 500);
    };

    private hackTerminal = async () => {
        this._moduleContainer.innerHTML = '';

        try {
            const result = await this._opticalImplant.hackTerminal();

            if (!result) {
                console.warn('hacking failed');
                return;
            }

            this._moduleContainer.appendChild(result);

            await this.currWindow.restore();

            overwolf.games.inputTracking.onMouseDown.addListener(this.finishHackingListener);
            overwolf.games.inputTracking.onKeyUp.addListener(this.finishHackingListener);
        } finally {
            setTimeout(() => {
                this.hidePreloader();
            }, 1000);
        }
    };

    public static instance = () => {
        if (!this._instance) {
            this._instance = new InGame();
        }

        return this._instance;
    };
}

InGame.instance();
