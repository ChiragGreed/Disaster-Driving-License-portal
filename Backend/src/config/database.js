import mongoose from "mongoose"
import { Config } from "./config.js";

const ConntectToDb = ()=>{
    mongoose.connect(Config.MONGO_URI)
    .then((res)=>{
        console.log("MongoDb Connected");
    });
}

export default ConntectToDb