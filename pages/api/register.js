
import valid from '../../utils/valid';
const bcrypt = require('bcrypt');
import Users from '../../models/userModel';
import connectMongo from '../../connectMongo/connectMongo'

//connectMongo().catch(() => res.status(405).json({error: "Error in the Connection"}))

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

module.exports = async (req, res) => {
  await connectMongo()
  switch(req.method){
    case "POST":
      await register(req,res)
      break;
  }
}
  const register = async (req,res) => {
    try {
      
    // const client = await MongoClient.connect(process.env.MONGO_URI);
    // const db = client.db();
    // const usersCollection = db.collection("users");
  
    const { username, email,phone,sms,password, confPass,walletAddress,description } = JSON.parse(req.body);
    // console.log("register type",typeof req.body)
    // console.log("req",req.body)
    
    // const errMsg = valid(username, email, password, confPass)
    // if(errMsg) return res.status(400).json({err: errMsg})

    const userName = await Users.findOne({email})
    if (userName) return res.status(400).json({ err: 'This user already exists.' })
    // console.log("passwrd",typeof password)
    // const salt = await bcrypt.genSalt(10);
    // const passwordHash = await bcrypt.hash(password, salt, function(){})
    // console.log("passwordhash",passwordHash)

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
          // console.log("bcrypt error",err)
          // console.log("bcrypt hash",hash)

          const newUser = new Users({
            username,email,phone:'+'+phone,sms,password:hash,description,walletAddress,liked:[],commended:[],nfts:[],createdAt:Date.now()
          })
      
          await newUser.save();

          res.json({
            newUser,
            msg:"Register Success!"
          })

      });
    });


  } catch (error) {
    return res.status(400).json({err:err.message})
  }
}
