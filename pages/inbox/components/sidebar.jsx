import React,{useState,useEffect} from "react";
import {MdKeyboardArrowUp,MdKeyboardArrowDown} from 'react-icons/md'
import {BiMessageAdd} from 'react-icons/bi'
import { useSelector } from "react-redux";
import Chatlist from "./chatlist";
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import { getFirestore,addDoc, doc, updateDoc, arrayRemove, arrayUnion,getDoc,onSnapshot, collection } from 'firebase/firestore';
import { firebaseConfig } from '@/utils/firebase';
import { db } from "@/utils/firebase";
import { AiOutlineCloseCircle } from 'react-icons/ai'
import Media from "react-media";
import { Fragment } from "react";

const Sidebar = () => {

  const [chats,setChats] = useState([]);
  const [exists,setExists] = useState(null);
  const [openModal,setOpenModal] = useState(false);
  const [input,setInput] = useState('')

  useEffect(() => {
    const ref = collection(db,"chats");

    const unsubscribe = onSnapshot(ref,(snapshot) => {
        const chatls = snapshot?.docs.map(doc => ({
            id:doc.id,
            ...doc.data()
        }));
        setChats(chatls)
    },(error) => {
        console.error(error);
    })

    return () => {
        unsubscribe();
    }
  },[])

    const user = useSelector(state => state.auth.user)

    const chatExists = async (email) => {

    }

    const newChat = async (e) => {
      e.preventDefault()
      // console.log(input)
      // const chatu = chats.filter(chat => chat.users.includes(user.email))
      // const emailu = chats.filter(chat => chat.users.includes(input))
      // if(!chatu && !emailu){
      //   setExists(true)
      // }else{
      //   setExists(false)
      // }
      if(input !== user.email){
        await addDoc(collection(db,"chats"), { users: [user.email, input],read:false })
      }
      setInput("")
      setOpenModal(false)
    }

  return user?.username && (
    <Fragment>
    <Media queries={{
      small: "(max-width: 599px)", // < 600px
      medium: "(min-width: 1024px) and (max-width: 1366px)", // < 1366px
      large: "(min-width: 1400px)" // >= 1400px
    }}>

    {matches => (
    <Fragment>
    {matches.small &&
    <Fragment>
    <div className="w-full">
    <aside className="">
    <header className={openModal ? "relative h-[90px] border-b-[1px] border-slate-800 py-2 px-3" : "relative h-[60px] border-b-[1px] border-slate-800 py-3 "}>
        <div className={openModal ? "flex-col justify-center items-center" : "flex justify-center items-center"}>
        <button className="text-xl font-semibold flex justify-center items-center">{user.username}<MdKeyboardArrowDown size={26}/></button>
        {openModal && (
          <div className="flex gap-x-2 my-2">
          <input type="email" onChange={e => setInput(e.target.value)} placeholder="Enter email of chat" className="py-1 px-3 w-52 rounded-md outline-none bg-slate-800" required/>
          <button type="submit" onClick={newChat} className="bg-slate-800 border border-slate-700 px-5 py-1 rounded-md text-slate-400">Add</button>
          </div>
          )}
        </div>
        <BiMessageAdd size={24} className="absolute right-3 bottom-5 cursor-pointer" onClick={() => setOpenModal(!openModal)}/>

    </header>
    <Chatlist/>
    </aside>
    </div>
    </Fragment>
    }
    {matches.medium &&
    <Fragment>
    <aside className="w-[349px] flex-shrink-0 border-r border-slate-800">
    <header className={openModal ? "relative h-[90px] border-b-[1px] border-slate-800 py-2 px-3" : "relative h-[60px] border-b-[1px] border-slate-800 py-3 "}>
        <div className={openModal ? "flex-col justify-center items-center" : "flex justify-center items-center"}>
        <button className="text-xl font-semibold flex justify-center items-center">{user.username}<MdKeyboardArrowDown size={26}/></button>
        {openModal && (
          <div className="flex gap-x-2 my-2">
          <input type="email" onChange={e => setInput(e.target.value)} placeholder="Enter email of chat" className="py-1 px-3 w-52 rounded-md outline-none bg-slate-800" required/>
          <button type="submit" onClick={newChat} className="bg-slate-800 border border-slate-700 px-5 py-1 rounded-md text-slate-400">Add</button>
          </div>
          )}
        </div>
        <BiMessageAdd size={24} className="absolute right-3 bottom-5 cursor-pointer" onClick={() => setOpenModal(!openModal)}/>

    </header>
    <Chatlist/>
    </aside>
    </Fragment>
    }
    {matches.large &&
    <Fragment>
    <aside className="w-[349px] flex-shrink-0 border-r border-slate-800">
    <header className={openModal ? "relative h-[90px] border-b-[1px] border-slate-800 py-2 px-3" : "relative h-[60px] border-b-[1px] border-slate-800 py-3 "}>
        <div className={openModal ? "flex-col justify-center items-center" : "flex justify-center items-center"}>
        <button className="text-xl font-semibold flex justify-center items-center">{user.username}<MdKeyboardArrowDown size={26}/></button>
        {openModal && (
          <div className="flex gap-x-2 my-2">
          <input type="email" onChange={e => setInput(e.target.value)} placeholder="Enter email of chat" className="py-1 px-3 w-52 rounded-md outline-none bg-slate-800" required/>
          <button type="submit" onClick={newChat} className="bg-slate-800 border border-slate-700 px-5 py-1 rounded-md text-slate-400" title="Add Chat">Add</button>
          </div>
          )}
        </div>
        <BiMessageAdd size={24} className="absolute right-3 bottom-5 cursor-pointer" onClick={() => setOpenModal(!openModal)}/>

    </header>
    <Chatlist/>
    </aside>
    </Fragment>
    }
    </Fragment>
    )}

    </Media>
    </Fragment>
    );
};

export default Sidebar;
