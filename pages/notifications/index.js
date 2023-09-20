import React, { useEffect,useState } from "react";
import { Fragment } from "react";
import Media from "react-media";
import {BiBell} from 'react-icons/bi';
import TimeAgo from "@/components/TimeAgo";
import Head from 'next/head';
import { useRouter } from "next/router";
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import Link from "next/link";

const Notifications = () => {

  const router = useRouter()
  const [notidata,setNotiData] = useState([])
  const [usera,setUsera] = useState([]);
  const [detectid,setDetectId] = useState("");
  const [nonotify,setNoNotify] = useState([]);

  useEffect(() => {
    getUsers()
    getNotifications()
    tok()
  },[])

  const getNotifications = async () => {
    await fetch('https://testmarket.cos-in.com/api/notifications').then(res => {
    if(!res.ok){
      throw new Error("HTTP ERROR",res.status)
    }
    return res
  }).then(res => res.json()).then(data => {
    setNotiData(data)
  })
  }


  const getUsers = async () => {
    await fetch('https://testmarket.cos-in.com/api/users').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setUsera(data)
    })
  }

  const handleRead = async (e,id) => {
    e.preventDefault()
    const data = {
      id:id,
      read:true
    }
    await fetch("https://testmarket.cos-in.com/api/notifications", {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    router.reload(window.location.pathname)
  }

  const tok = async () => {
    const token = Cookies.get('refreshtoken');
    const decodedToken = jwt.decode(token);
    const expr = decodedToken?.exp * 1000 > Date.now();
    if (!token && !expr ) {
      router.push('/login');
    }else{
      setDetectId(decodedToken?.id)
    }
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
          <Head>
          <title>Notifications • Cosmeta NFT Marketplace</title>
          </Head>
          <div className="h-full w-[44vh] py-5 overflow-hidden">
            <div className="flex-col justify-center items-center w-full px-7">
              <h1 className="flex-col text-center justify-center w-full items-center rounded-lg bg-gradient-to-t to-slate-900 from-transparent hover:opacity-70 text-slate-400 cursor-pointer py-3 px-5 container mx-auto text-3xl my-10">Notifications</h1>
              {!notidata.length &&
                <div className="w-full flex justify-center items-center text-slate-500 py-20">
                  <div className="flex gap-x-2 justify-center items-center">
                  <BiBell size={80}/>
                  <h1 className="text-5xl font-black">Notification Not Yet</h1>
                  </div>
                </div>
              }
              <div className="container mx-auto grid gap-y-2 overflow-y-scroll h-[100vh] pb-10">
                {notidata.reverse().map((noti,k) => 
                <div key={k} className="border border-slate-800 bg-slate-900 container mx-auto py-3 px-7 items-center rounded-md text-xl" onClick={(e) => handleRead(e,noti._id)}>
                <div className="flex justify-between items-center w-full">
                <div className="flex justify-start items-center w-full">
                  <span>{noti.message}</span>
                </div>
                <div className="flex justify-end items-center self-end w-full">
                <TimeAgo timestamp={noti.createdAt}/>
                </div>
                <div className="flex justify-end items-center ml-3">
                {noti.read == false ? <div className="bg-blue-500 rounded-full w-3 h-3">&nbsp;</div> : <div className="pl-2">&nbsp;</div>}
                </div>
              </div>   
                
                </div>
                )}
              </div>
            </div>
          </div>
          </Fragment>
        }

        {matches.medium &&
          <Fragment>
          <Head>
          <title>Notifications • Cosmeta NFT Marketplace</title>
          </Head>
          <div className="w-[100vh] py-5 overflow-hidden h-full">
            <div className="flex-col justify-center items-center w-full px-7">
              <h1 className="flex-col text-center justify-center w-full items-center rounded-lg bg-gradient-to-t to-slate-900 from-transparent hover:opacity-70 text-slate-400 cursor-pointer py-3 px-5 container mx-auto text-3xl my-10">Notifications</h1>
              {!notidata.length &&
                <div className="w-full flex justify-center items-center text-slate-500 py-20">
                  <div className="flex gap-x-2 justify-center items-center">
                  <BiBell size={80}/>
                  <h1 className="text-5xl font-black">Notification Not Yet</h1>
                  </div>
                </div>
              }
              <div className="container mx-auto grid gap-y-2 overflow-y-scroll h-[100vh] pb-10">
                {notidata.reverse().reverse().map((noti,k) => 
                <div key={k} className="border border-slate-800 bg-slate-900 container mx-auto py-3 px-7 items-center rounded-md text-xl" onClick={(e) => handleRead(e,noti._id)}>
                <div className="flex justify-between items-center w-full">
                <div className="flex justify-start items-center w-full">
                  <span>{noti.message}</span>
                </div>
                <div className="flex justify-end items-center self-end w-full">
                <TimeAgo timestamp={noti.createdAt}/>
                </div>
                <div className="flex justify-end items-center ml-3">
                {noti.read == false ? <div className="bg-blue-500 rounded-full w-3 h-3">&nbsp;</div> : <div className="pl-2">&nbsp;</div>}
                </div>
              </div>  
                
                </div>
                )}
              </div>
            </div>
          </div>
          </Fragment>
        }

        {matches.large &&
          <Fragment>
          <Head>
          <title>Notifications • Cosmeta NFT Marketplace</title>
          </Head>
          <div className="w-[100vh] py-5 overflow-hidden h-screen">
            <div className="flex-col justify-center items-center w-full px-7">
              <h1 className="flex-col text-center justify-center w-full items-center rounded-lg bg-gradient-to-t to-slate-900 from-transparent hover:opacity-70 text-slate-400 cursor-pointer py-3 px-5 container mx-auto text-3xl my-10">Notifications</h1>
              {!notidata.length ?
                <div className="w-full flex justify-center items-center text-slate-500 py-20">
                  <div className="flex gap-x-2 justify-center items-center">
                  <BiBell size={80}/>
                  <h1 className="text-5xl font-black">Notification Not Yet</h1>
                  </div>
                </div>
                : null
              }
              <div className="container mx-auto grid gap-y-2 overflow-y-scroll pb-10">
                {notidata.reverse().filter(u => u.recipient == detectid).map((noti,k) => 
                <div key={k} className="border text-slate-400 border-slate-800 bg-slate-900 container mx-auto py-3 px-7 items-center rounded-md text-xl cursor-pointer hover:border-blue-500">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex justify-start items-center w-full gap-x-1">
                    <Link href={`/${noti.sender}`} className="hover:text-white"><span >{noti.sender}</span></Link>
                      <span >{noti.message}</span>
                    </div>
                    <div className="flex justify-end items-center self-end w-full" onClick={(e) => handleRead(e,noti._id)}>
                    <TimeAgo timestamp={noti.createdAt}/>
                    </div>
                    <div className="flex justify-end items-center ml-3">
                    {noti.read == false ? <div className="bg-blue-500 rounded-full w-3 h-3">&nbsp;</div> : null}
                    </div>
                  </div>  
                </div>
                )}
              </div>
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

export default Notifications;
