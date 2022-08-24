import { createWorker, ImageLike, OEM, PSM, WorkerParams } from 'tesseract.js';

export class LocalOcr {
    private workerParams: Partial<WorkerParams> = {
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
        tessedit_ocr_engine_mode: OEM.LSTM_ONLY,
    };
    private workers = new Map<string, ReturnType<typeof createWorker>>();

    public async recognize(image: ImageLike, lang: string, width: number, height: number) {
        const worker = await this.createWorker(lang, this.workerParams);

        const result = await worker.recognize(image, {
            rectangle: { left: 0, top: 0, width, height },
        });

        return result.data;
    }

    private async createWorker(lang: string, params: Partial<WorkerParams>) {
        if (this.workers.get(lang)) {
            return this.workers.get(lang);
        }

        const workerParams = {
            logger: args => console.log({ ...args }),
        }

        const worker = createWorker(workerParams);

        await worker.load();
        await worker.loadLanguage(lang);
        await worker.initialize(lang);
        await worker.setParameters(params);

        this.workers.set(lang, worker)

        return worker;
    }
}
