import mongoose, { Mongoose } from "mongoose";

type connectionObject = {
    isConnected? : number
}


const connection : connectionObject = {}

async function dbConnect():Promise<void> {
    if(connection.isConnected){
        console.log("already connected to the database")
        return;
    }
    try{
        const db  = await mongoose.connect(process.env.MONGODB_URI || "", {})
        connection.isConnected = db.connections[0].readyState

        console.log("database connected successfully")
        // console.log(db.connections)
        // console.log(db)
    }
    catch(error){
console.log("database connection failed because of : ", error)
process.exit()

    }
    
}
export default dbConnect