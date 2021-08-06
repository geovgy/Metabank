require('dotenv').config();
export const ENV = process.env.REACT_APP_ENV;

console.log("env == ", process.env)

const isProduction = ENV.toLowerCase() === 'production';
const isLocalHost = ENV.toLowerCase() === 'development';



const stagingConfig = {

};

const localConfig = {
};

const productionConfig = {
};


export const config = isProduction ? productionConfig  : localConfig;
console.log(config)
