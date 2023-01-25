import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import utilitiesRoutes from './routes/utilities.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.send('healthy');
})

app.use("/utilities", utilitiesRoutes);

http.createServer(app).listen(1337, () =>
console.log('express listening on port:', 1337));