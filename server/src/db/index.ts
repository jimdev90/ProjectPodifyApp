import mongoose from "mongoose";
import { MONGO_URI } from '#/utils/variables';




mongoose.set('strictQuery', true);

mongoose.connect(MONGO_URI).then(() => {
    console.log('Db Connected')
}).catch((error) => {
    console.log('Db connection failed: ' + error);
})