import React, { useState } from "react";
import { RiSendPlaneFill } from 'react-icons/ri'
import { addDoc,doc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "@/utils/firebase";
import Media from "react-media";
import { Fragment } from "react";

const Reply = ({conversationId}) => {

    const [input,setInput] = useState("")

    const user = useSelector(state => state.auth.user)

    const sendMessage = async (e) => {
        e.preventDefault()
        const chatid = conversationId
        const ref = doc(db,"chats",chatid);
        const updated = {
            read:false
        }
        await addDoc(collection(db,"chats",conversationId,"messages"), {
            text: input,
            sender: user.email,
            timestampt: serverTimestamp()
        })
        await updateDoc(ref,updated)
        setInput("")
    }

  return (
    <div>
    <Media queries={{
        small: "(max-width: 599px)", // < 600px
        medium: "(min-width: 1024px) and (max-width: 1366px)", // < 1366px
        large: "(min-width: 1400px)" // >= 1400px
      }}>
    {matches => (
    <Fragment>
        {matches.small &&
        <Fragment>
        <footer className=" px-6 h-[84px] flex justify-center items-center pb-5">
        <form onSubmit={sendMessage} className="h-[44px] border border-slate-400 rounded-full flex justify-between items-center w-full pl-[11px] pr-[8px]">
            <div className="flex justify-start items-center w-full">
                <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="Message..." className="flex-1 focus:placeholder:text-slate-600 h-[40px] text-sm bg-transparent px-3 outline-none selection:bg-blue-300 selection:text-slate-900" />
            </div>
            <div className="flex justify-end items-center mx-3 transition-all">
            {input &&
            <button type="submit" className="transition-all">
            <RiSendPlaneFill size={25} className="text-slate-400" onClick={sendMessage}/>
            </button>}
            </div>
        </form>
    </footer>
        </Fragment>
        }
        {matches.medium &&
        <Fragment>
        <footer className=" px-6 h-[84px] flex justify-center items-center">
        <form onSubmit={sendMessage} className="h-[44px] border border-slate-400 rounded-full flex justify-between items-center w-full pl-[11px] pr-[8px]">
            <div className="flex justify-start items-center w-full">
                <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="Message..." className="flex-1 focus:placeholder:text-slate-600 h-[40px] text-sm bg-transparent px-3 outline-none selection:bg-blue-300 selection:text-slate-900" />
            </div>
            <div className="flex justify-end items-center mx-3 transition-all">
            {input &&
            <button type="submit" className="transition-all">
            <RiSendPlaneFill size={25} className="text-slate-400" onClick={sendMessage}/>
            </button>}
            </div>
        </form>
    </footer>
        </Fragment>
        }
        {matches.large &&
        <Fragment>
        <footer className=" px-6 h-[84px] flex justify-center items-center">
        <form onSubmit={sendMessage} className="h-[44px] border border-slate-400 rounded-full flex justify-between items-center w-full pl-[11px] pr-[8px]">
            <div className="flex justify-start items-center w-full">
                <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="Message..." className="flex-1 focus:placeholder:text-slate-600 h-[40px] text-sm bg-transparent px-3 outline-none selection:bg-blue-300 selection:text-slate-900" />
            </div>
            <div className="flex justify-end items-center mx-3 transition-all">
            {input &&
            <button type="submit" className="transition-all">
            <RiSendPlaneFill size={25} className="text-slate-400" onClick={sendMessage}/>
            </button>}
            </div>
        </form>
    </footer>
        </Fragment>
        }
    </Fragment>    
    )}

    </Media>
    </div>
    );
};

export default Reply;
