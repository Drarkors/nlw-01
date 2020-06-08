import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.100.6:3333' //'http://192.168.15.13:3333'
});

export default api;