import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    nftId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'NFT'
    },
    liker:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    likeravatar:{
        type:String,
    },
    createdAt:{
        type:String
    }
},{
    timestamps:true
})
module.exports = mongoose.models.Like || mongoose.model("Like", likeSchema ,'likes')
let Like = mongoose.models.Like || mongoose.model('Like', likeSchema , 'likes')
export default Like