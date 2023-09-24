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
        case "POST":
            await setcomment(req,res)
            break;
        case "DELETE":
            await delcomment(req,res)
            break;
    }
}
const setcomment = async (req,res) => {
    try {
        
        const {nftId,author,comtext,authoravatar,username} = req.body;
        await connectMongo()

        const comment = new COM({
            nftId:ObjectId(nftId),
            author:author,
            comtext:comtext,
            authoravatar:authoravatar,
            username:username,
            createdAt: Date.now()
        });
        await comment.save();

        const comm = await COM.findOne({ nftId: ObjectId(nftId) })
        // console.log("comm",comm)

        const nft = await NFT.findOne({ _id: ObjectId(nftId)}).populate('comments');
        const user = await Users.findOne({ _id: ObjectId(author) }).populate('commended');
        nft.comments.push(comm._id)
        user.commended.push(ObjectId(comm._id))
        await nft.save();
        await user.save();

        const nftusername = nft.username
        const users = await Users.findOne({ username:nftusername })

        const notifications = new Notification({
            recipient: users._id,
            sender:user.username,
            message: 'commented your nft.',
            createdAt: Date.now()
        });
        await notifications.save();

        res.status(200).json({ msg: `${user.username} commented your nft.` });
    } catch (err) {
        return res.status(500).json({err: err.message})
    }

}

const delcomment = async (req,res) => {
        const {comId,author} = req.body;
        await connectMongo()
    try {
        await NFT.updateOne({ _id: ObjectId(comId) }, { $pull: { comments: { $in: [author] } } });
        await Users.updateOne({ _id: author }, { $pull: { commended: { $in: [ObjectId(comId)] } } });
        await COM.deleteMany({ author: author });
        res.status(200).json({msg:"Comment deleted"})
    } catch (err) {
        res.status(500).json({msg:"Server Error"})
    }
}