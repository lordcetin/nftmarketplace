import mongoose from 'mongoose';

const comSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      sender:{
        type: String,
      },
      message: {
        type: String,
        required: true
      },
      read: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type:String
      }
},{
    timestamps:true
})
module.exports = mongoose.models.Notification || mongoose.model("Notification", comSchema ,'notis')
let Notification = mongoose.models.Notification || mongoose.model('Notification', comSchema , 'notis')
export default Notification