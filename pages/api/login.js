import { MongoClient } from "mongodb";
import valid from '../../utils/valid';
import bcrypt from 'bcrypt';
import { createAccessToken,createRefreshToken } from '../../utils/generateToken'
import connectMongo from '../../connectMongo/connectMongo';
import Users from '../../models/userModel';

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

    
//connectMongo().catch(() => res.status(405).json({error: "Error in the Connection"}))
module.exports = async (req, res) => {
    switch(req.method){
        case "POST":
            await login(req,res)
            break;
    }
}
const login = async (req,res) => {

        // const client = await MongoClient.connect(process.env.MONGO_URI);
        // const db = client.db();
        // const usersCollection = db.collection("users");
        
        const {email,password} = JSON.parse(req.body)
        await connectMongo()
        // const errorMsg = valid(req.body.email,req.body.password)
        // if(errorMsg){
        //    return res.status(400).json({err: errorMsg})
        // }

        const user = await Users.findOne({ email })
        if(!user) return res.status(400).json({err: 'This user does not exist'})
        
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({err:'incorrect password'})
      
        const accessToken = createAccessToken({id: user._id, username:user.username , email:user.email, phone:user.phone})
        const refreshtoken = createRefreshToken({id: user._id , username:user.username , email:user.email, phone:user.phone})
        res.json({message: "Hello, World!"})
        res.status(201).json({ 
            msg: "Login Success",
            refreshtoken,
            accessToken,
            user:{
                id:user._id,
                username: user.username,
                email: user.email,
                phone:user.phone,
                role: user.role,
                avatar: user.avatar,
                banner: user.banner,
                root: user.root,
                description: user.description,
                wallet: user.walletAddress,
                liked:user.liked,
                commended:user.commended,
                nfts:user.nfts,
            }
        });
        

}

