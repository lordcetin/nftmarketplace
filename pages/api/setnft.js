import { MongoClient, ObjectId } from "mongodb";
import NFT from '../../models/nftSchema';
import Users from "@/models/userModel";
import connectMongo from "@/connectMongo/connectMongo";
import Notification from "@/models/notiSchema";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
    
//connectMongo().catch(() => res.status(405).json({error: "Error in the Connection"}))
module.exports = async (req, res) => {
    try {
        await connectMongo();
    switch(req.method){
        case "POST":
            await setnft(req,res)
            break;
        case "GET":
            await getNfts(req,res)
            break;
        case "PUT":
            await updateNfts(req,res)
            break;
        case "DELETE":
            await deleteNfts(req,res)
            break;
    }
    } catch (error) {
        res.status(500).json({ err: "Error in the Connection" });
    }
}
const setnft = async (req,res) => {
    try {
        const { id,name,description,price,bidprice,images,createdWallet,itemId,transactionHash,tokenId,fileType,traits,tokenURI,website,username,avatar,wichNet,role,seller,owner,winner,sold,live,biddable,bids,duration } = req.body;
        const nftDatas = new NFT({
            id,
            itemId,
            transactionHash,
            name,
            description,
            price,
            bidprice,
            images,
            avatar,
            role,
            username,
            createdWallet,
            tokenId,
            seller,
            owner,
            winner,
            sold,
            live,
            biddable,
            bids,
            duration,
            fileType,
            wichNet,
            website,
            likes:[],
            comments:[],
            traits,
            tokenURI,
            createdAt:Date.now()
        })

        await nftDatas.save();

        res.status(201).json({msg:"NFT Created!"})

    } catch (err) {
        return res.status(500).json({err: err.message})
    }

}

const getNfts = async (req,res) => {
    try {
        const nft = await NFT.find({})

        res.status(200).json(nft)
    } catch (error) {
        return res.status(500).json({err: error.message})
    }
}

const updateNfts = async (req,res) => {
    try {
        const {bidprice,id,live,biddable,bids,duration,winner,owner,createdWallet,sold,price,resell} = req.body;
        await connectMongo()
        console.log("req",req.body)
        const filter = { _id : ObjectId(id) }
        const update = {bidprice:bidprice,biddable:biddable,resell:resell,live:live,bids:bids,sold:sold,price:price,duration:duration,winner:winner,owner:owner,createdWallet:createdWallet}
    
        let doc = await NFT.updateOne(filter,update,{upsert: true})
        // let doc = await NFT.findOneAndUpdate(filter,update,{ new: true, upsert: true});
        doc.save();

        res.status(201).json({msg:"Bidprice changed"})
        
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteNfts = async (req,res) => {
    try{
        const {id} = req.body;
        await connectMongo()
        NFT.deleteOne({ _id: id }).then(() => {
            res.status(200).json({msg:"NFT Deleted!"})
        })

    }catch(err){
        res.status(500).json({msg:err})
    }
}

