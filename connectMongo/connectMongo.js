import mongoose from 'mongoose';

const connectMongo = async () => {
    try{
        mongoose.set('strictQuery',false)
        const {connection} = await mongoose.connect(process.env.MONGO_URI)
        if(connection.readyState == 1){
            // console.log("Database Connected")
        }
    }catch(error){
        return Promise.reject(error)
    }
}

export default connectMongo;