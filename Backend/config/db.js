import mongoose from "mongoose";

const Connectdb=async()=>{
    try{
        mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB Connected")
    }
    catch(error){
        console.log(error.message);
        process.exit(1)
    }
}
export default Connectdb;