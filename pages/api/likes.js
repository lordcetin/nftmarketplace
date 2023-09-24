import { MongoClient, ObjectId } from "mongodb";
import Like from '@/models/likeSchema';
import NFT from '@/models/nftSchema';
import Users from "@/models/userModel";
import connectMongo from "@/connectMongo/connectMongo";
import Notification from "@/models/notiSchema";
// import { Server } from "socket.io"

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
*/

module.exports = async (req, res) => {

    switch(req.method){
        case "GET":
            await getLike(req,res)
            break;
        case "POST":
            await setlike(req,res)
            break;
        case "DELETE":
            await delike(req,res)
            break;
    }
}

const getLike = async (req,res) => {
    try {
    // const io = new Server(res.socket.server)
    // res.socket.server.io = io
    await connectMongo()
    const like = await Like.find({});
    // io.on('connection', (socket) => {
    //    socket.on('likeUpdate', (nftid) => {
    //         io.emit('likeUpdate likes endpoint',nftid);
    //       console.log('likeUpdate',nftid)
    //             // Burada gelen verileri kullanarak işlemler yapabilirsiniz.
    //     });
    //       console.log('a user connected');
    // });
        res.status(200).json(like)

    } catch (error) {
        res.status(500).json({msg:error})
    }
}
const setlike = async (req,res) => {
    const {nftId,liker,likeravatar} = req.body;
    await connectMongo()
    try {
        // const io = new Server(res.socket.server)
        // req.socket.server.io = io

        const existingLike = await Like.findOne({nftId: ObjectId(nftId)});
        const existingLiker = await Like.findOne({liker: ObjectId(liker)});

        if(existingLike && existingLiker){
            return res.status(400).json({msg:"This user has already liked this NFT"})
        }else{
            const like = new Like({
                nftId:ObjectId(nftId),
                liker:ObjectId(liker),
                likeravatar:likeravatar,
                createdAt: Date.now()
            });
    
            await like.save();

            const user = await Users.findOne({ _id: ObjectId(liker) }).populate('liked')
            const existingUserLiked = user.liked.find(like => like.equals(ObjectId(nftId)));
    
            const nft = await NFT.findOne({ _id: nftId}).populate('likes');
            const existingLikes = nft.likes.find(like => like.equals(liker));
            const nftusername = nft.username
            const users = await Users.findOne({ username:nftusername })
    
            if(existingLikes && existingUserLiked){
                return res.status(400).json({msg:"This user has already liked this NFT"})
            }else{
                nft.likes.push(user._id)
                user.liked.push(ObjectId(nftId))  
                await nft.save();
                await user.save();
                const notifications = new Notification({
                    recipient: users._id,
                    sender:user.username,
                    message: 'liked your nft.',
                    createdAt: Date.now()
                });
                await notifications.save();
                // io.sockets.emit('likeUpdated', nftId);
    
                res.status(200).json({ msg: `${user.username} liked your nft.` });

            }
        }

    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

const delike = async (req,res) => {
        const {nftId,liker} = req.body;
        await connectMongo()
    try {

            await NFT.updateOne({ _id: ObjectId(nftId) }, { $pull: { likes: { $in: [liker] } } });
            await Users.updateOne({ _id: liker }, { $pull: { liked: { $in: [ObjectId(nftId)] } } });
            await Like.deleteMany({ liker: liker });

            res.status(200).json({msg:"Like deleted"})
    } catch (err) {
        res.status(500).json({msg:"Server Error"})
    }
}