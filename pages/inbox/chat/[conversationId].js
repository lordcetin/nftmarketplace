import React,{useEffect} from "react";
import Sidebar from "../components/sidebar";
import Chatbox from ".";
import Media from "react-media";
import { Fragment } from "react";
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, updateDoc, arrayRemove, arrayUnion,getDoc,onSnapshot, collection,addDoc} from 'firebase/firestore';
import { firebaseConfig } from '@/utils/firebase';
const Chat = () => {


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
		<div className="h-full py-20 pb-40">
		<div className="flex border-2 my-10 border-slate-800 rounded-md w-[300px] h-[calc(100vh-150px)]">
		{/*<Sidebar/>*/}
		<Chatbox/>
		</div>
		</div>
		</Fragment>
		}
		{matches.medium &&
		<Fragment>
		<div className="h-full py-20 pb-40">
		<div className="flex container mx-auto my-10 w-[800px] h-[calc(100vh-150px)]">
		<Sidebar/>
		<Chatbox/>
		</div>
		</div>
		</Fragment>
		}
		{matches.large &&
		<Fragment>
		<div className="h-full py-20 pb-40">
		<div className="flex container mx-auto my-10 w-[1000px] h-[calc(100vh-150px)] ">
		<Sidebar/>
		<Chatbox/>
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

export default Chat;
