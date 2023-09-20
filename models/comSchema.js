import mongoose from 'mongoose';

const comSchema = new mongoose.Schema({
    nftId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'NFT'
    },
    comId:{
        type:String
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    comtext:{
        type:String
    },
    authoravatar:{
        type:String,
    },
    username:{
        type:String
    },
    createdAt:{
        type:String
    }
},{
    timestamps:true
})
module.exports = mongoose.models.COM || mongoose.model("COM", comSchema ,'coms')
let COM = mongoose.models.COM || mongoose.model('COM', comSchema , 'coms')
export default COM