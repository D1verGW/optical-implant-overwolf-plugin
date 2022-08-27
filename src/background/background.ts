import {
  OWGames,
  OWGameListener,
  OWWindow
} from '@overwolf/overwolf-api-ts';

import { kWindowNames, kGameClassIds } from "../consts";
import httpTransport from '../http-transport';

import RunningGameInfo = overwolf.games.RunningGameInfo;
import AppLaunchTriggeredEvent = overwolf.extensions.AppLaunchTriggeredEvent;

// The background controller holds all of the app's background logic - hence its name. it has
// many possible use cases, for example sharing data between windows, or, in our case,
// managing which window is currently presented to the user. To that end, it holds a dictionary
// of the windows available in the app.
// Our background controller implements the Singleton design pattern, since only one
// instance of it should exist.
class BackgroundController {
  private static _instance: BackgroundController;
  private _windows: Record<string, OWWindow> = {};
  private _gameListener: OWGameListener;

  private constructor() {
    // Populating the background controller's window dictionary
    this._windows[kWindowNames.inGame] = new OWWindow(kWindowNames.inGame);
    this._windows[kWindowNames.glitch] = new OWWindow(kWindowNames.glitch);

    // When a a supported game game is started or is ended, toggle the app's windows
    this._gameListener = new OWGameListener({
      onGameStarted: this.toggleWindows.bind(this),
      onGameEnded: this.toggleWindows.bind(this)
    });

    overwolf.extensions.onAppLaunchTriggered.addListener(
      e => this.onAppLaunchTriggered(e)
    );
  };

  // Implementing the Singleton design pattern
  public static instance(): BackgroundController {
    if (!BackgroundController._instance) {
      BackgroundController._instance = new BackgroundController();
    }

    return BackgroundController._instance;
  }

  // When running the app, start listening to games' status and decide which window should
  // be launched first, based on whether a supported game is currently running
  public async run() {
    this._gameListener.start();

    this.eachWindow(w => w.restore());

    httpTransport.get('/wake-up-neo');
  }

  private eachWindow(cb) {
    Object.values(this._windows).forEach(window => cb(window));
  }

  private async onAppLaunchTriggered(e: AppLaunchTriggeredEvent) {
    console.log('onAppLaunchTriggered():', e);

    if (!e || e.origin.includes('gamelaunchevent')) {
      return;
    }

    if (await BackgroundController.isSupportedGameRunning()) {
      this.eachWindow(w => w.restore());
    } else {
      this.eachWindow(w => w.close());
    }
  }

  private toggleWindows(info: RunningGameInfo) {
    if (!info || !BackgroundController.isSupportedGame(info)) {
      return;
    }

    if (info.isRunning) {
      this.eachWindow(w => w.restore());
    } else {
      this.eachWindow(w => w.close());
    }
  }

  private static async isSupportedGameRunning(): Promise<boolean> {
    const info = await OWGames.getRunningGameInfo();

    return info && info.isRunning && BackgroundController.isSupportedGame(info);
  }

  // Identify whether the RunningGameInfo object we have references a supported game
  private static isSupportedGame(info: RunningGameInfo) {
    return kGameClassIds.includes(info.classId);
  }
}

BackgroundController.instance().run();
