import { config } from 'dotenv'
config();

if (!process.env.MONGO_URI) {
    throw new Error("Mongo Uri not found in environmental variables")
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT Secret not found in environmental variables")
}

export const Config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
}