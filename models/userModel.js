import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type:String,required:true },
    email: {type:String,required:true,unique:true},
    phone: {type:String,required:true,unique:true},
    sms: {type:String},
    password: {type:String,require:true},
    role: {type:String,default:'user'},
    root: {type:Boolean,default:false},
    description:{type:String},
    instagram:{type:String,default:'https://instagram.com'},
    twitter:{type:String,default:'https://twitter.com'},
    walletAddress: {type:String,lowercase: false},
    liked:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'NFT',
    }],
    commended:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'COM',
    }],
    nfts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'NFT',
    }],
    avatar: {type:String,default:'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg'},
    banner:{type:String,default:'https://bafybeihkjdaxrbzc37aqro7x5ggttlor6fbo3fbtv5zb3p4seiwyzxcqmi.ipfs.nftstorage.link'},
    createdAt:{
        type:String
    }
},{
    timestamps:true
})
module.exports = mongoose.models.Users || mongoose.model("Users", userSchema ,'users')
let Users = mongoose.models.Users || mongoose.model('Users', userSchema , 'users')
export default Users