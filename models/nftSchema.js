import mongoose from 'mongoose';

const nftSchema = new mongoose.Schema({
    id:{
        type:String,
    },
    name:{
        type:String,
        trim:true,
    },
    price:{
        type:Number,
        trim: true
    },
    bidprice:{
        type:Number,
        trim: true
    },
    description:{
        type:String,
    },
    images:{
        type:String,
    },
    sold:{
        type:Boolean,
    },
    avatar:{
        type:String
    },
    role:{
        type:String,
    },
    username:{
        type:String,
    },
    createdWallet:{
        type:String,
        lowercase: false,
    },
    itemId:{
        type:Number,
    },
    tokenId:{
        type:Number,
    },
    seller:{
        type:String,
        lowercase: false,
    },
    transactionHash:{
        type:String,
        lowercase: false
    },
    owner:{
        type:String,
        lowercase: false,
    },
    winner:{
        type:String,
        lowercase: false,
    },
    sold:{
        type:Boolean,
    },
    live:{
        type:Boolean,
    },
    biddable:{
        type:Boolean,
    },
    bids:{
        type:Number,
    },
    duration:{
        type:Number,
    },
    fileType:{
        type:String,
    },
    wichNet:{
        type:String
    },
    website:{
        type:String
    },
    resell:{
        default:false,
        type:Boolean
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Like',
    }],
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    tokenURI:{
        type:String
    },
    traits:[{
        type:Array,
    }],
    createdAt:{
        type:String
    }
},{
    timestamps:true
})
module.exports = mongoose.models.NFT || mongoose.model("NFT", nftSchema ,'nfts')
let NFT = mongoose.models.NFT || mongoose.model('NFT', nftSchema , 'nfts')
export default NFT