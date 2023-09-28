/* eslint-disable import/no-anonymous-default-export */
import { MongoClient,ObjectId } from "mongodb";

import connectMongo from "../../connectMongo/connectMongo";
import Users from "../../models/userModel";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

module.exports = async  (req,res) => {
    await connectMongo()
    switch(req.method){
        case "PUT":
            await update(req,res)
            break;
    }
}
const update = async (req,res) => {
    try {
    const {bannerurl,avatarurl,desc,instagram,twitter,id} = JSON.parse(req.body);
    console.log(req.body);
    const filter = { _id : ObjectId(id) }
    const update = {banner:bannerurl,avatar:avatarurl,description:desc,instagram:instagram,twitter:twitter}

    let doc = await Users.findOneAndUpdate(filter,update,{ new: true, upsert: true});

    await doc.save();

    res.status(201).json({
        data: await Users.findOne({ _id: id }),
        message: "Updated"
    });
    }catch(err){
        console.log(err)
        return res.status(500).json({err:err.message})
    }
    
}