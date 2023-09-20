import jwt from 'jsonwebtoken'
import { MongoClient } from "mongodb";


const auth = async (req, res) => {
    
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db();
    const usersCollection = db.collection("users");

    const token = req.headers.authorization;
    if(!token) return res.status(400).json({err: 'Invalid Authentication.'})

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if(!decoded) return res.status(400).json({err: 'Invalid Authentication.'})

    const user = await usersCollection.findOne({_id: decoded.id})

    return {id: user._id, role: user.role, root: user.root};
}


export default auth