import dotenv from 'dotenv';

dotenv.config();

const config = {
    development: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'Nhat2005',
        database: process.env.DB_NAME || 'ecommerce_db',
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    test: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: 'ecommerce_test',
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
};

export default config;
