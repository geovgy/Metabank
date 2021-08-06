import axios from 'axios';

const axio = axios.create({
    baseURL: '',
  timeout: 9999999,//100000,
});

// axio.interceptors.request.use((config) => {
//     const customConfig = config;
//     if (localStorage.getItem('stadiumJWToken')) {
//       let webToken = JSON.parse(localStorage.getItem('stadiumJWToken'));
//       if (new Date(webToken.date) >= Date.now()) {
//         customConfig.headers.Authorization = webToken.bearer;
//       }
//     }
//     return customConfig;
//   });

export default axio;