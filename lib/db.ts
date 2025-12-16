import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;
    if(connectionState === 1) {
        console.log("already connected")
        return;
    } else if(connectionState === 2) {
        console.log("Conecting...")
        return;
    }

    try{
        mongoose.connect(MONGODB_URI!, {
            dbName: "Next15restapi",
            bufferCommands: true
        });
        console.log("connected")
    }catch(error:any){
        console.error("disconnected",error)
        throw new Error(error);
    }

}

export default connect;