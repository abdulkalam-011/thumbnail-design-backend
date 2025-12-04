import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();


// cors middleware 
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

// to accept json data 
app.use(express.json({limit:"16kb"}))

// to accept data from url
app.use(express.urlencoded({extended:true}))

// serves static files
app.use(express.static("public"))

// cookie parser middleware to perform cors operations on browser on cookies
app.use(cookieParser()) 

app.use(morgan('dev'));





app.get('/', (req, res) => {
  res.send('Hello, World!');
});


export default app;