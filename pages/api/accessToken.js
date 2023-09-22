import jwt from 'jsonwebtoken'
import { createAccessToken } from '../../utils/generateToken';
import { MongoClient } from 'mongodb';
import connectMongo from '../../connectMongo/connectMongo';
import Users from '../../models/userModel';


/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

//connectMongo().catch(() => res.status(405).json({error: "Error in the Connection"}))

module.exports = async (req, res) => {
  try{
      await connectMongo()
      // const client = await MongoClient.connect(process.env.MONGO_URI);
      // const db = client.db();
      // const usersCollection = db.collection("users");

      const rf_token = req.cookies.refreshtoken;
      if(!rf_token) return res.status(400).json({err: 'Please login now!'})
    
      const result = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET)
      if(!result) return res.status(400).json({err: 'Your token is incorrect or has expired.'})

      const user = await Users.findById(result.id)

      if(!user) return res.status(400).json({err: 'User does not exist.'})

      const access_token = createAccessToken({id: user._id})
      res.json({
          access_token,
          user: {
              id:user._id,
              username: user.username,
              email: user.email,
              phone:user.phone,
              role: user.role,
              avatar: user.avatar,
              banner:user.banner,
              root: user.root,
              liked:user.liked,
              commended:user.commended,
              nfts:user.nfts,
          }
      })
    }catch(err){
      return res.status(500).json({err: err.message})
    }
      
    }
