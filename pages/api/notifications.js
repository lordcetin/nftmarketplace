import { MongoClient, ObjectId } from "mongodb";
import Notification from "@/models/notiSchema";
import connectMongo from "@/connectMongo/connectMongo";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
*/
    
//connectMongo().catch(() => res.status(405).json({error: "Error in the Connection"}))
module.exports = async  (req, res) => {
    switch(req.method){
        case "GET":
            await getNotifications(req,res)
            break;
        case "PUT":
            await updateNotify(req,res)
            break;
    }
}

const getNotifications = async (req,res) => {
    try {
        await connectMongo()
        const nft = await Notification.find({})
        res.status(200).json(nft)
    } catch (error) {
        return res.status(500).json({err: err.message})        
    }
}
const updateNotify = async (req,res) => {
    try {
        const {id,read} = req.body;
        await connectMongo()
        console.log("req",req.body)
        const filter = { _id : ObjectId(id) }
        const update = {read:read}
    
        let doc = await Notification.updateOne(filter,update,{upsert: true})
        // let doc = await NFT.findOneAndUpdate(filter,update,{ new: true, upsert: true});
        doc.save();

        res.status(201).json({msg:"Read status changed"})
        res.json({message: "Hello, World!"})
        
    } catch (error) {
        res.status(500).json(error)
    }
}
