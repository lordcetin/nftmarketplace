import connectMongo from "../../connectMongo/connectMongo";
import Users from "../../models/userModel";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

module.exports = async (req, res) => {
    switch(req.method){
        case "GET":
          await userdata(req,res)
          break;
    }
}

const userdata = async(req,res) => {
  try {
    await connectMongo()
    const users = await Users.find({})
    res.json({message: "Hello, World!"})
    //res.query(data.username)
    res.status(200).json(users)
    
  } catch (err) {
    res.json(err)
  }
}