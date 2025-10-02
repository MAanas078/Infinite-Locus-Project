import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'


import userRoutes from './routes/userRoutes.js'
import ItemRoutes from './routes/ItemRoutes.js'


const app = express()
dotenv.config();

// --- CORS Configuration ---
// This will only allow requests from the URLs in the allowedOrigins array.
const allowedOrigins = ['https://lost-found-infinite.vercel.app', 'http://localhost:3000'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This is important for sending cookies and authorization headers
};

app.use(cors(corsOptions));
// --- End CORS Configuration ---


app.use(express.json())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

// The custom header middleware is no longer needed as the 'cors' package handles it.

app.use('/users', userRoutes)

app.use('/Items', ItemRoutes)


const port = process.env.PORT || 4000;
const db = process.env.DB;

// to surpass the warning
mongoose.set('strictQuery', true);

mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => app.listen(port,() => console.log('Connection done and running on PORT :'+ port))).catch((err) => console.log(err.message));
