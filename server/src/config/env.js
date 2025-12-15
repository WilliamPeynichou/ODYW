import dotenv from 'dotenv';

// dans dotenv 
dotenv.config();

const required=["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"];
for (const key of required) {
    if(!process.env[key]) {
        throw new Error(`${key} n'est pas defini dans le fichier d'environnement`)
    }
}

export const env = {
    port: process.env.PORT,
    db:{
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    },
    jwtSecret: process.env.JWT_SECRET,
}