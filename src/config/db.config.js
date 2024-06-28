import dotenv from 'dotenv'; 
dotenv.config(); 

export default {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/monterdb'
}