
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { connectDB } = require('./config/db');
const routes = require('./routes/routes');
const authRoutes = require('./routes/auth.route');





dotenv.config()

const app = express()
const port = process.env.PORT


app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  })
);

// routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api', routes)
// routes



app.get('/', (req, res) => {
  res.send('Hello World!')
})


connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`⚙️  Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });