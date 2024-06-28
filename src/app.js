import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './utils/db.utils.js';

const PORT = process.env.PORT || 3000;
const app = express()

connectDB();


app.get("/", (req, res) => {
    res.json({ message: "ok" });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
