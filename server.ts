import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import utilitiesRoutes from './routes/utilities.js';

// Connection URI
const uri = process.env.MONGO_URI;
const db = process.env.MONGO_DB
mongoose.set("strictQuery", false);
mongoose.connect(uri + '/' + db);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.send('healthy');
})

app.use("/utilities", utilitiesRoutes);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
  console.log({level: 'info', message: 'database connected successfully!'})

  http.createServer(app).listen(1337, () =>
  console.log({level: 'info', message: `express listening on port: ${1337}`}));
});