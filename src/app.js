import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './utils/db.utils.js';
import authRouter from './routes/auth.route.js';

const PORT = process.env.PORT || 3000;
const app = express()

connectDB();

app.use(bodyParser.json());

app.use('/profile', authRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
