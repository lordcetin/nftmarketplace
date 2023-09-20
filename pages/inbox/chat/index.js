import React,{useState,useEffect, Fragment} from "react";
import Header from "./components/header";
import Reply from "./components/reply";
import Messages from "./components/messages";
import { useRouter } from "next/router";
import { useCollectionData,useDocumentData } from 'react-firebase-hooks/firestore';
import { collection, orderBy,query,doc ,onSnapshot,updateDoc} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useSelector } from "react-redux";
import getOtherEmail from "@/utils/getOtherEmail";
import Media from "react-media";
import Head from 'next/head';

const Chatbox = () => {

  const [msg,setMsg] = useState([]);

  const router = useRouter();
  const { conversationId } = router.query;

  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    const id = conversationId
    const ref = collection(db,"chats",id,"messages");
    const q = query(ref,orderBy('timestampt'))

    const unsubscribe = onSnapshot(q,(snapshot) => {
        const msg = snapshot?.docs.map(doc => ({
            id:doc.id,
            ...doc.data()
        }));
        setMsg(msg)
    },(error) => {
        console.error(error);
    })

    return () => {
        unsubscribe();
    }
  },[])

  const [chat] = useDocumentData(doc(db,"chats",conversationId))


  const q = query(collection(db,"chats",conversationId,"messages"))
  const [messages] = useCollectionData(q);


	useEffect(() => {
		handleRead()
	},[])

    const handleRead = async () => {
        const chatid = conversationId
        const ref = doc(db,"chats",chatid);
        const updated = {
            read: true
        }
        await updateDoc(ref, updated)
    }
  

  return 	(
    <div>
    <Media queries={{
			small: "(max-width: 599px)", // < 600px
			medium: "(min-width: 1024px) and (max-width: 1366px)", // < 1366px
			large: "(min-width: 1400px)" // >= 1400px
		  }}>
      {matches => (
      <Fragment>
      <Head>
      <title>{chat?.user} • Cosmeta NFT Marketplace</title>
      </Head>
        {matches.small &&
        <Fragment>
        <div className="flex-1">
        <Header email={getOtherEmail(chat?.users , user)}/>
        <div className="block container items-center text-slate-400 w-full">
        <Messages messages={msg} />
        <Reply conversationId={conversationId}/>
        </div>
        </div>
        </Fragment>
        }
        {matches.medium &&
        <Fragment>
        <Head>
        <title>{chat?.user} • Cosmeta NFT Marketplace</title>
        </Head>
          <div className="flex-1">
          <Header email={getOtherEmail(chat?.users , user)}/>
          <div className="block container items-center text-slate-400 w-full">
          <Messages messages={msg} />
          <Reply conversationId={conversationId}/>
          </div>
          </div>
        </Fragment>
        }
        {matches.large &&
        <Fragment>
        <Head>
        <title>{chat?.user} • Cosmeta NFT Marketplace</title>
        </Head>
          <div className="flex-1">
          <Header email={getOtherEmail(chat?.users , user)} user={user}/>
          <div className="block container items-center text-slate-400 w-full">
          <Messages messages={msg} />
          <Reply conversationId={conversationId}/>
          </div>
          </div>
        </Fragment>
        }
      </Fragment>  
      )}
    </Media>
    </div>
  );
};

export default Chatbox;
