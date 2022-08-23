import axios from 'axios';

const httpTransport = axios.create({
    baseURL: process.env.OCR_BACKEND_URL || 'http://localhost:3030',
    headers: {},
});

export default httpTransport;
