import { MongoClient, ObjectId } from "mongodb";
import COM from '@/models/comSchema';
import NFT from '@/models/nftSchema';
import Users from "@/models/userModel";
import connectMongo from "@/connectMongo/connectMongo";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
*/

module.exports = async (req, res) => {
    switch(req.method){
        case "GET":
            await getComments(req,res)
            break;
    }
}
const getComments = async (req,res) => {
    try {
        await connectMongo()

        const com = await COM.find({});

        return res.status(200).json(com)
    } catch (err) {
        return res.status(500).json({err: err.message})
    }

}
