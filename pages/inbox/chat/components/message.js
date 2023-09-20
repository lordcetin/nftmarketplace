import React,{useEffect,useState} from "react";
import { useSelector } from "react-redux";

const Message = ({message}) => {
    // console.log("message",message)
    const [sender,setSender] = useState(false);
    
    const user = useSelector(state => state.auth.user)

    useEffect(() => {
        const sender = message.sender === user.email
        if(sender){
            setSender(true)
        }else{
            setSender(false)
        }
    },[])
    
  return (
    <div className={sender ? "flex justify-center items-center bg-slate-900 ml-7 max-w-lg max-h-lg self-end py-2 px-3 rounded-2xl" : "flex justify-center items-center mr-7 max-w-lg border border-slate-900 self-start py-2 px-3 rounded-2xl"}>
        {message.text}
    </div>
    );
};

export default Message;
{/*    <div className={user.uid == message.from.id ? "flex gap-x-2 max-w-[40%] self-end" : "flex gap-x-2 self-start"}>
    {user.uid != message.from.id && (
    <div>
        <img src={message.from.avatar} alt="" className="w-6 h-6 rounded-full self-end" />
    </div>
    )}
        <p style={{hyphens:"auto"}} className={user.uid != message.from.id ? "min-h-[44px] inline-flex items-center py-3 px-5 rounded-3xl border border-slate-900 text-sm ":"min-h-[44px] inline-flex py-3 items-center px-5 rounded-3xl text-sm bg-slate-900"}>
            {message.message}
        </p>

    </div>*/}