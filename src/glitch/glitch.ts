import { AppWindow } from '../app-window';
import { kWindowNames } from '../consts';
import { OpticalImplant } from '../implant';
import { OverwolfApi } from '../overwolf-api';

const OI = new OpticalImplant();

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

class GlitchWindow extends AppWindow {
  private static _instance: GlitchWindow;
  private _moduleContainer: HTMLElement;
  private _opticalImplant: OpticalImplant;

  private constructor() {
    super(kWindowNames.glitch);

    this._opticalImplant = OI;

    this._moduleContainer = document.getElementById('app');
  }

  public async run() {
    const gameInfo = await this.getCurrentGameInfo();

    overwolf.windows.changePosition(this.currentWindowId, 0, 0);
    overwolf.windows.changeSize(this.currentWindowId, gameInfo.width, gameInfo.height);

    await this.currWindow.minimize();

    overwolf.windows.onStateChanged.addListener((event) => {
      console.log(event);

      if (event.window_name !== kWindowNames.glitch) {
        return;
      }

      switch (event.window_state_ex) {
        case overwolf.windows.enums.WindowStateEx.NORMAL: {
          this.show();
          break;
        }
        case overwolf.windows.enums.WindowStateEx.HIDDEN: {
          this.hide();
          break;
        }
      }
    });
  }

  public static instance() {
    if (!this._instance) {
      this._instance = new GlitchWindow();
    }

    return this._instance;
  }

  private hide() {
    this._moduleContainer.innerHTML = '';
  }

  public async show() {
    this._moduleContainer.innerHTML = '';
    this._moduleContainer.style.opacity = '0.8';

    const screenshotUrl = await OverwolfApi.takeScreenshot();
    const screenshotImage = await OverwolfApi.getScreenshotImage(screenshotUrl);

    const ctx = screenshotImage.getContext('2d');

    const stepSize = 30;

    for(let i = 0; i < screenshotImage.height; i += stepSize) {
      const clearPartNum = getRndInteger(i, 50);

      ctx.clearRect(0, i, screenshotImage.width, clearPartNum);

      i += clearPartNum;
    }

    for(let i = 0; i <= 5; i++) {
      const glitchNode = document.createElement('div');
      glitchNode.className = 'glitch__item';

      glitchNode.style.background = `url("${screenshotImage.toDataURL()}") no-repeat 50% 50%/cover`;

      this._moduleContainer.appendChild(glitchNode);
    }
  }
}

GlitchWindow.instance().run();
