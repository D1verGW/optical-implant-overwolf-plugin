import { OWWindow } from '@overwolf/overwolf-api-ts/dist/ow-window';
import GetRunningGameInfoResult = overwolf.games.GetRunningGameInfoResult;

export class AppWindow {
  protected currWindow: OWWindow;
  protected mainWindow: OWWindow;
  public currentWindowId: string;

  constructor(windowName) {
    this.mainWindow = new OWWindow('background');
    this.currWindow = new OWWindow(windowName);
    this.currentWindowId = windowName;
  }

  public async getCurrentGameInfo() {
    return new Promise<GetRunningGameInfoResult>(r => overwolf.games.getRunningGameInfo(r));
  };

  public async getWindowState() {
    return await this.currWindow.getWindowState();
  }
}
