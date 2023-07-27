import express from 'express';
import 'dotenv/config'
import './db';
import authRouter from './router/auth'

const app = express();

// Register our middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('src/public'))


app.use('/auth', authRouter);


const PORT = process.env.PORT || 8989


app.listen(PORT, function(){
    console.log("Servidor corriendo en el puerto: " + PORT)
})