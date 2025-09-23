//This class builds a central API URL so that it isn't confined to a hardcoded url and port.
//Makes it significantly easier to change the API URL and port in one place.
const envApi = process.env.REACT_APP_API;
const host = process.env.REACT_APP_API_HOST || 'localhost';
const port = process.env.REACT_APP_API_PORT || '8080';

export const API = envApi ? envApi.replace(/\/+$/,'') : `http://${host}:${port}`;

export default API;
