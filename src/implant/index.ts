import chunk from 'lodash/chunk';
import { CURRENT_TOOL_TEXT_POSITION, MATRIX_POSITION, TARGETS_POSITION } from '../consts';
import { processMatrix, processTargets } from '../utils';
import { OverwolfApi } from '../overwolf-api';
import { OCR } from './ocr';
import { solve } from './solver';

export class OpticalImplant {
    private ocr: OCR;

    constructor() {
        this.ocr = new OCR();
    }

    private getMatrixScreenshotImage = (src: string): Promise<HTMLCanvasElement> => {
        return OverwolfApi.getBlackAndWhiteScreenshotImage(src, MATRIX_POSITION);
    };

    private getTargetsScreenshotImage = (src: string): Promise<HTMLCanvasElement> => {
        return OverwolfApi.getBlackAndWhiteScreenshotImage(src, TARGETS_POSITION);
    };

    private getCurrentToolTextScreenshot = (src: string): Promise<HTMLCanvasElement> => {
        return OverwolfApi.getBlackAndWhiteScreenshotImage(src, CURRENT_TOOL_TEXT_POSITION);
    };

    isHackingEnabled = async (): Promise<boolean> => {
        const screenshotUrl = await OverwolfApi.takeScreenshot();

        const screenshot = await this.getCurrentToolTextScreenshot(screenshotUrl);

        await OverwolfApi.removeStorage();

        const ocrResult = await this.ocr.recognize(screenshot, 'rus');

        console.log('ocrResult.text', ocrResult.text, ocrResult);

        return !!ocrResult.text?.includes('МАТРИЦА');
    };

    hackTerminal = async () => {
        console.log('taking a screenshot...');

        const screenshotUrl = await OverwolfApi.takeScreenshot();
        const matrixScreenshot = await this.getMatrixScreenshotImage(screenshotUrl);
        const targetsScreenshot = await this.getTargetsScreenshotImage(screenshotUrl);
        await OverwolfApi.removeStorage();

        const [matrixData, targetsData] = [await this.ocr.recognize(matrixScreenshot, 'cyber'), await this.ocr.recognize(targetsScreenshot, 'cyber')];

        console.log('OcrService result:', matrixData, targetsData);

        if (matrixData.text.length === 0 || targetsData.text.length === 0) {
            return;
        }

        const { lines: matrix, chars } = processMatrix(matrixData.text);

        console.log('recognized matrix:', matrix, chars);

        const targets = processTargets(targetsData.text, chars);

        console.log('recognized targets:', targets);

        // TODO: take care about buffer size recognition
        const bufferSizeLocal = window.localStorage.getItem('buffer_size') || '8';

        const bufferSize = parseInt(bufferSizeLocal, 10);
        const hiddenTargets = new Set();

        const inputIsValid =
            matrix.length > 2 && targets.length && matrix[0].length > 2;

        const final = (() => {
            const resultMatrix = Array.from({ length: matrix.length }).map((row, rowIndex) => {
                return Array.from({ length: matrix.length });
            });

            const targetsToUse = targets.filter(
                target => !hiddenTargets.has(target.join('-')),
            );

            if (inputIsValid && targetsToUse.length && bufferSize) {
                const chosens = solve(matrix, targetsToUse, bufferSize);
                const chosenSeq = chosens[0] || { seq: [], matchedIndices: [] };
                const chosenBytes: Record<string, number> = {};

                chunk(chosenSeq.seq, 2).forEach(([row, col], i) => {
                    chosenBytes[`${row},${col}`] = i;
                    resultMatrix[row][col] = i;
                });

                return { chosenBytes, matched: new Set(chosenSeq.matchedIndices), resultMatrix };
            }

            return { chosenBytes: {} as Record<string, number>, matched: new Set(), resultMatrix };
        })();

        console.log(final);

        const result = document.createElement('div');

        result.className = 'table';

        // TODO: take care about smaller matrix size

        // TODO: take care about game resolution
        if (matrix.length === 6) {
            result.style.top = '75px';
            result.style.left = '165px';
        }

        // TODO: take care about game resolution
        if (matrix.length === 7) {
            result.style.top = '75px';
            result.style.left = '125px';
        }

        // TODO: take care about game resolution
        result.style.width = `${matrix.length * 86}px`;
        result.style.height = `${matrix.length * 86}px`;

        final.resultMatrix.forEach(row => {
            const rowEl = document.createElement('div');
            rowEl.className = 'row';

            row.forEach(cell => {
                const cellEl = document.createElement('div');
                cellEl.className = 'cell';
                cellEl.innerHTML = '&nbsp;';

                if (typeof cell === 'number') {
                    cellEl.innerHTML = '';

                    cellEl.className += ' filled';

                    const valEl = document.createElement('span');

                    valEl.innerHTML = `${cell + 1}`;
                    valEl.className = 'value';
                    valEl.dataset.text = `${cell + 1}`;

                    cellEl.appendChild(valEl);
                }

                rowEl.appendChild(cellEl);
            });

            result.appendChild(rowEl);
        });

        return result;
    };
}
