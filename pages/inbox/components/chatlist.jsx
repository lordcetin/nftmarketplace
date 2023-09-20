import React, { useEffect,useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCollection } from 'react-firebase-hooks/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import { getFirestore,doc, updateDoc, arrayRemove, arrayUnion,getDoc,onSnapshot, collection, deleteDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/utils/firebase';
import getOtherEmail from "@/utils/getOtherEmail";
import { useSelector } from "react-redux";
import { db } from "@/utils/firebase";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { AiFillCloseCircle } from 'react-icons/ai';

const Chatlist = (param) => {

    const user = useSelector(state => state.auth.user)

    const [chats,setChats] = useState([]);
    const [mail,setMail] = useState("");

    const router = useRouter()

    const handleDelete = async (e,chatid) => {
        e.preventDefault()
        const ref = doc(db,"chats",chatid);
        await deleteDoc(ref)
    }

    useEffect(() => {
        const ref = collection(db,"chats");
        const token = Cookies.get('refreshtoken');
        const decodedToken = jwt.decode(token);
        setMail(decodedToken?.email)

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
    

  return (
    <div className="h-[calc(100%-60px)] overflow-auto">
    <header className="flex items-center justify-between p-4">
        <h6 className="text-base font-semibold">Messages</h6>
        <button className="text-sm">Requests</button>
    </header>
{/*chats.map(chat => (
<Link key={chat.id} href={`/inbox/chat/${chat.id}`} className={chat?.unread == true ? "flex font-extrabold justify-between items-center transition-all hover:bg-slate-900 py-2 px-2 gap-x-2" : "flex items-center transition-all hover:bg-slate-900 py-2 px-2 gap-x-2"}>
        <img src={chat.user.avatar} alt="Yunus Cetin" className="w-14 h-14 rounded-full" />
        <div className="flex-col justify-start w-full">
            <div className="font-semibold text-md">
                {chat.users.name}
            </div>
            <div className="text-sm">
                {chat.lastMessage}
            </div>
        </div>
        <div className="">
            {chat?.unread == true ? <span className="text-4xl text-blue-500 mr-2">•</span> : null}
        </div>
</Link>
))*/}
    <ul>
    {chats?.filter(chat => chat.users.includes(user.email))
        .map(chat => 
        <div className="flex w-full group/item" key={Math.random()}>
            <Link href={`/inbox/chat/${chat.id}`} className="justify-between items-center transition-all my-2 bg-slate-900 mx-3 cursor-pointer rounded-lg hover:bg-slate-800 py-5 px-3 gap-x-2 flex w-full">
                {getOtherEmail(chat.users , user)}
                {chat.read == false ? <span className="inline-flex items-center w-3 h-3 bg-blue-500 rounded-full animate-pulse">&nbsp;</span> : null }
                <AiFillCloseCircle size={22} title="Remove" className="group/edit invisible text-slate-400 hover:text-white group-hover/item:visible" onClick={(e) => handleDelete(e,chat.id)}/>
            </Link>
        </div>
    )}
    </ul>
    </div>
    );
};

export default Chatlist;
