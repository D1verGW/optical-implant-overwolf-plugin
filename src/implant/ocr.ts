import httpTransport from '../http-transport';

export class OCR {
    public async recognize(image: HTMLCanvasElement, lang: string) {
        const requestParams = {
            data: {
                image: image.toDataURL(),
                imageParams: {
                    width: image.width,
                    height: image.height,
                },
            },
            lang,
        };

        const result = await httpTransport.post('/recognize', requestParams);

        return result.data.data;
    }
}
