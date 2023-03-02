import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import passportLocalMongoose from 'passport-local-mongoose';
import session from 'express-session';

import utilitiesRoutes from './routes/utilities.js';
import index from './routes/index.js';
// import clientRoutes from './routes/clients.js;
// import userRoutes from './routes/user.js;
// import documentRoutes from './routes/documentRoutes.js;

// Connection URI
const uri = process.env.MONGO_URI;
const db = process.env.MONGO_DB
mongoose.set("strictQuery", false);
mongoose.connect(uri + '/' + db);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: "Savage Serendipitous Solutions",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/health', (req, res) => {
  res.send('healthy');
})

app.use('/', index)
app.use("/utilities", utilitiesRoutes);


mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
  console.log({level: 'info', message: 'database connected successfully!'})

  http.createServer(app).listen(1337, () =>
  console.log({level: 'info', message: `express listening on port: ${1337}`}));
});