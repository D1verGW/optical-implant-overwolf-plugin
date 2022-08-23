import { threshold } from './utils';

enum StorageSpace {
    pictures = 'pictures',
    videos = 'videos',
    appData = 'appData',
}

type PositionedRect2D = { x: number, y: number, width: number, height: number }

export abstract class OverwolfApi {
    static getStoragePath = (): Promise<string> => {
        return new Promise(r => {
            // @ts-ignore
            overwolf.extensions.io.getStoragePath(StorageSpace.pictures, result => r(result.path));
        });
    };

    static removeStorage = () =>
        new Promise(async r => {
            // @ts-ignore
            overwolf.extensions.io.delete(StorageSpace.pictures, await this.getStoragePath(), r);
        });

    static takeScreenshot = (): Promise<string> => {
        return new Promise(async r => overwolf.media.takeScreenshot(await OverwolfApi.getStoragePath(), result => r(result.url)));
    };

    static getScreenshotImage = (screenshotUrl: string, pictureBoundaries?: PositionedRect2D): Promise<HTMLCanvasElement> => {
        return new Promise(async resolve => {
            const img = document.createElement('img');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                const { width, height } = pictureBoundaries || img;
                const { x = 0, y = 0 } = pictureBoundaries || {};

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

                resolve(canvas);

                if (process.env.NODE_ENV !== 'production') {
                    const logImg = document.createElement('img');
                    logImg.src = canvas.toDataURL();
                    logImg.style.visibility = 'none';
                    logImg.width = 0;
                    logImg.height = 0;

                    document.body.appendChild(logImg);
                }
            };

            img.src = screenshotUrl;
        });
    };

    static getBlackAndWhiteScreenshotImage = async (screenshotUrl: string, pictureBoundaries: PositionedRect2D): Promise<HTMLCanvasElement> => {
        const canvasImage = await OverwolfApi.getScreenshotImage(screenshotUrl, pictureBoundaries);

        threshold(canvasImage.getContext('2d'));

        return canvasImage;
    };
}
