import axios from 'axios';
import axiosRetry from 'axios-retry';

const httpTransport = axios.create({
    baseURL: process.env.OCR_BACKEND_URL || 'http://localhost:3030',
    headers: {},
});

axiosRetry(httpTransport, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export default httpTransport;
