import React from 'react';
import {useState,useEffect, Fragment} from 'react';
import { useRouter } from 'next/router';
import { useStateContext } from '../context/StateContext';
import {BiImageAdd} from 'react-icons/bi'
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { DataContext } from '../store/GlobalState';
import { useContext } from 'react';
import {BsInstagram,BsTwitter} from 'react-icons/bs'
import {create as ipfsHttpClient} from 'ipfs-http-client';
const { Buffer } = require("buffer");
import Media from 'react-media';
import { useSelector } from 'react-redux';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, updateDoc, arrayRemove, arrayUnion,getDoc,onSnapshot, collection,addDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/utils/firebase';
import { AiOutlineCloseCircle } from 'react-icons/ai'
import Head from 'next/head';
import Image from 'next/image';
import { Loading } from '@nextui-org/react';

const Settings = ({profiledetail,param,setOpenSettings,userData}) => {

  const {user,getUser,connectUser} = useStateContext();

  const [changeImage,setChangeImage] = useState(false)
  const [bannerfileUrl,setBannerFile] = useState(false);
  const [profilefileUrl,setProfileFile] = useState(false);
  const [bannerloading,setBannerLoading] = useState(false);
  const [profileloading,setProfileLoading] = useState(false);
  const [profile,setToken] = useState(false);
  const [instalink,setInstagramLink] = useState("");
  const [twitterlink,setTwitterLink] = useState("");
  const [descript,setDescription] = useState("");


  
  const [totalP,setTotalPrice] = useState(0);
  const [totalN,setTotalNFTs] = useState(0);

  const router = useRouter()  
  const username = router.query.profile

  const [allauction,MumAllAuction] = useState([]);

  const [accounts, setUsers] = useState(null);
  const [userDatas, setUserDatas] = useState(null);

  const {state,dispatch} = useContext(DataContext)
  const {auth} = state

  const account = useSelector(state => state.auth.user)

  // console.log(auth)
  //console.log(userData.find(u => u.username == param))

  //let username = profiledetail.username
  const application = initializeApp(firebaseConfig);
  const authorization = getAuth(application);
  const db = getFirestore(application);



  const projectId = "2FraJroGw9rXeeUTFgGRO7P7sFy";
  const projectSecretKey = "0a5ffc989190cb176f8729872bfbf76d";
  const autho = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
    "base64"
    )}`;
    const client = ipfsHttpClient({
      host: "infura-ipfs.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: autho,
      },
    });

  const updateBannerContent = async (e) => {
    e.preventDefault();
    setBannerLoading(true);
    const file = e.target.files[0]
    const subdomain = "https://cosmeta.infura-ipfs.io";
    try {
        const added = await client.add(
            file,
            {
                progress: (prog) => console.log(""/*received: ${prog}*/)
            }
        )
        const bannerurl = `${subdomain}/ipfs/${added.path}`;
       setBannerFile(bannerurl)
       let id = profile._id
       const contentData = {bannerurl,id}
       await fetch('https://testnet.cos-in.com/api/update',{
       method:'PUT',
       body:JSON.stringify(contentData),
       headers:{ "Content-Type":"aplication/json" }
     }).then(res => {
       if(!res.ok){
         throw new Error("HTTP ERROR",res.status)
       }
       return res;
     }).then((res) => res.json()).then((data) => {
      //  console.log("Update",data)
      router.reload(window.location.pathname)
     })
    } catch (error) {
        //console.log('Error uploading file: ', error)
    }
    setBannerLoading(false);
}
   const updateContent = async () => {
    let desc = descript
    let id = profile._id
    const contentData = {desc,id}
    await fetch('https://testnet.cos-in.com/api/update',{
    method:'PUT',
    body:JSON.stringify(contentData),
    headers:{ "Content-Type":"aplication/json" }
  }).then(res => {
    if(!res.ok){
      throw new Error("HTTP ERROR",res.status)
    }
    return res;
  }).then((res) => res.json()).then((data) => {
    // console.log("Update",data)
    router.reload(window.location.pathname)
  })

}
   const updateInstagram = async () => {
    let instagram = instalink
    let id = profile._id
    const contentData = {instagram,id}
    await fetch('https://testnet.cos-in.com/api/update',{
    method:'PUT',
    body:JSON.stringify(contentData),
    headers:{ "Content-Type":"aplication/json" }
  }).then(res => {
    if(!res.ok){
      throw new Error("HTTP ERROR",res.status)
    }
    return res;
  }).then((res) => res.json()).then((data) => {
    // console.log("Update",data)
    router.reload(window.location.pathname)
  })

}
   const updateTwitter = async () => {
    let twitter = twitterlink
    let id = profile._id
    const contentData = {twitter,id}
    await fetch('https://testnet.cos-in.com/api/update',{
    method:'PUT',
    body:JSON.stringify(contentData),
    headers:{ "Content-Type":"aplication/json" }
  }).then(res => {
    if(!res.ok){
      throw new Error("HTTP ERROR",res.status)
    }
    return res;
  }).then((res) => res.json()).then((data) => {
    // console.log("Update",data)
    router.reload(window.location.pathname)
  })

}
   const updatePPContent = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    const file = e.target.files[0]
    const subdomain = "https://cosmeta.infura-ipfs.io";
    try {
        const added = await client.add(
            file,
            {
                progress: (prog) => console.log(`received: ${prog}`)
            }
        )
        const avatarurl = `${subdomain}/ipfs/${added.path}`;
       setProfileFile(avatarurl)
       let id = profile._id
       const contentData = {avatarurl,id}
       await fetch('https://testnet.cos-in.com/api/update',{
       method:'PUT',
       body:JSON.stringify(contentData),
       headers:{ "Content-Type":"aplication/json" }
     }).then(res => {
       if(!res.ok){
         throw new Error("HTTP ERROR",res.status)
       }
       return res;
     }).then((res) => res.json()).then((data) => {
      //  console.log("Update",data)
      router.reload(window.location.pathname)
     })
    } catch (error) {
        //console.log('Error uploading file: ', error)
    }
    setProfileLoading(false);
}


useEffect(() => {
  const token = Cookies.get('refreshtoken');
  const decodedToken = jwt.decode(token);
  const expr = decodedToken?.exp * 1000 > Date.now();
  if (!token && !expr ) {
    router.push('/login');
  }else{
    const datas = userData.filter(u => u.username == decodedToken?.username)
    setToken(datas[0])
  }
},[])

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
            <title>Settings • Cosmeta NFT Marketplace</title>
            </Head>
            <div className='h-full py-20 flex flex-col items-center w-full px-4'>
              <h1 className='text-2xl font-medium antialiased leading-6 my-2'>Settings</h1>
              {/* PROFILE */}
              <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                  <h1 className='text-xl font-semibold'>Profile Picture</h1>
                  <div className='white-glassmorphism my-3 p-3 flex justify-between items-center w-full'>
                  <img src={profile?.avatar} alt='Profile Picture' width={50} height={50} className='rounded-full'/>
                  <form onSubmit={updatePPContent}>
                    <label className='inline-flex py-4 px-4 bg-indigo-600 rounded-xl'>{profileloading ? <Loading/> : "Change"}
                    <input
                      className='hidden absolute h-52 -left-96'
                      type="file"
                      name="Asset"
                      onChange={updatePPContent}
                    />
                  </label>
                  </form>
                  </div>
              </div>
              {/* BANNER */}
              <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                  <h1 className='text-xl font-semibold'>Banner Picture</h1>
                  <div className='white-glassmorphism my-3 p-3 flex justify-between items-center w-full'>
                  <img src={profile?.banner} alt='Banner Picture' width={100} height={100} className='rounded-xl'/>
                  <form onSubmit={updateBannerContent}>
                    <label className='inline-flex py-4 px-4 bg-indigo-600 rounded-xl'>{bannerloading ? <Loading/> : "Change"}
                    <input
                      className='hidden absolute h-52 -left-96'
                      type="file"
                      name="Asset"
                      onChange={updateBannerContent}
                    />
                  </label>
                  </form>
                  </div>
              </div>
              {/* DESCRIPTION */}
              <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                  <h1 className='text-xl font-semibold'>Description</h1>
                  <div className='white-glassmorphism my-3 p-3 flex items-center w-full gap-x-3'>
                    <textarea
                    className='p-3 white-glassmorphism w-full'
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={profile?.description}/>
                    <button type='button' onClick={updateContent} className='flex justify-center items-center py-4 px-4 bg-indigo-600 rounded-xl'>Change</button>
                  </div>
              </div>
              {/* INSTAGRAM */}
              <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                  <h1 className='text-xl font-semibold'>Instagram</h1>
                  <div className='white-glassmorphism my-3 p-3 flex items-center w-full gap-x-3'>
                    <input
                    className='px-3 white-glassmorphism w-full py-2'
                    onChange={(e) => setInstagramLink(e.target.value)}
                    placeholder={profile?.instagram}/>
                    <button type='button' onClick={updateInstagram} className='flex justify-center items-center py-4 px-4 bg-indigo-600 rounded-xl'>Change</button>
                  </div>
              </div>
              {/* TWITTER */}
              <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                  <h1 className='text-xl font-semibold'>Twitter</h1>
                  <div className='white-glassmorphism my-3 p-3 flex items-center w-full gap-x-3'>
                    <input
                    className='px-3 white-glassmorphism w-full py-2'
                    onChange={(e) => setTwitterLink(e.target.value)}
                    placeholder={profile?.twitter}/>
                    <button type='button' onClick={updateTwitter} className='flex justify-center items-center py-4 px-4 bg-indigo-600 rounded-xl'>Change</button>
                  </div>
              </div>
            </div>
            </Fragment>
            }

            {matches.medium && 
              <Fragment>
              <Head>
              <title>Settings • Cosmeta NFT Marketplace</title>
              </Head>
              <div className='h-full py-20 flex flex-col items-center w-full px-4'>
                <h1 className='text-2xl font-medium antialiased leading-6 my-2'>Settings</h1>
                {/* PROFILE */}
                <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                    <h1 className='text-xl font-semibold'>Profile Picture</h1>
                    <div className='white-glassmorphism my-3 p-3 flex justify-between items-center w-full'>
                    <img src={profile?.avatar} alt='Profile Picture' width={50} height={50} className='rounded-full'/>
                    <form onSubmit={updatePPContent}>
                      <label className='inline-flex py-4 px-4 bg-indigo-600 rounded-xl'>{profileloading ? <Loading/> : "Change"}
                      <input
                        className='hidden absolute h-52 -left-96'
                        type="file"
                        name="Asset"
                        onChange={updatePPContent}
                      />
                    </label>
                    </form>
                    </div>
                </div>
                {/* BANNER */}
                <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                    <h1 className='text-xl font-semibold'>Banner Picture</h1>
                    <div className='white-glassmorphism my-3 p-3 flex justify-between items-center w-full'>
                    <img src={profile?.banner} alt='Banner Picture' width={100} height={100} className='rounded-xl'/>
                    <form onSubmit={updateBannerContent}>
                      <label className='inline-flex py-4 px-4 bg-indigo-600 rounded-xl'>{bannerloading ? <Loading/> : "Change"}
                      <input
                        className='hidden absolute h-52 -left-96'
                        type="file"
                        name="Asset"
                        onChange={updateBannerContent}
                      />
                    </label>
                    </form>
                    </div>
                </div>
                {/* DESCRIPTION */}
                <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                    <h1 className='text-xl font-semibold'>Description</h1>
                    <div className='white-glassmorphism my-3 p-3 flex items-center w-full gap-x-3'>
                      <textarea
                      className='p-3 white-glassmorphism w-full'
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={profile?.description}/>
                      <button type='button' onClick={updateContent} className='flex justify-center items-center py-4 px-4 bg-indigo-600 rounded-xl'>Change</button>
                    </div>
                </div>
                {/* INSTAGRAM */}
                <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                    <h1 className='text-xl font-semibold'>Instagram</h1>
                    <div className='white-glassmorphism my-3 p-3 flex items-center w-full gap-x-3'>
                      <input
                      className='px-3 white-glassmorphism w-full py-2'
                      onChange={(e) => setInstagramLink(e.target.value)}
                      placeholder={profile?.instagram}/>
                      <button type='button' onClick={updateInstagram} className='flex justify-center items-center py-4 px-4 bg-indigo-600 rounded-xl'>Change</button>
                    </div>
                </div>
                {/* TWITTER */}
                <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                    <h1 className='text-xl font-semibold'>Twitter</h1>
                    <div className='white-glassmorphism my-3 p-3 flex items-center w-full gap-x-3'>
                      <input
                      className='px-3 white-glassmorphism w-full py-2'
                      onChange={(e) => setTwitterLink(e.target.value)}
                      placeholder={profile?.twitter}/>
                      <button type='button' onClick={updateTwitter} className='flex justify-center items-center py-4 px-4 bg-indigo-600 rounded-xl'>Change</button>
                    </div>
                </div>
              </div>
              </Fragment>
            }

            {matches.large && 
              <Fragment>
              <Head>
              <title>Settings • Cosmeta NFT Marketplace</title>
              </Head>
              <div className='flex justify-between items-center w-full'>

              <div className='flex flex-col w-2/6 justify-start items-center p-10'>
                <div className='flex flex-col items-center w-full h-[500px] white-glassmorphism p-5'>
                  <img src={profile?.banner} className='object-cover w-full h-36 rounded-xl'/>
                  <img src={profile?.avatar} className='object-cover w-20 h-20 rounded-full relative -top-10'/>
                  <h1 className='text-2xl font-semibold antialiased leading-3'>{profile.username}</h1>
                  <h1 className='white-glassmorphism w-full h-20 rounded-lg py-1 px-3 mt-5 truncate'>{profile.description}</h1>
                  <div className='flex items-center gap-x-2 text-sm text-slate-400 my-2 self-start'><BsInstagram/><span>{profile.instagram}</span></div>
                  <div className='flex items-center gap-x-2 text-sm text-slate-400 my-2 self-start'><BsTwitter/><span>{profile.twitter}</span></div>
                </div>
              </div>

              <div className='justify-end h-full py-20 flex flex-col items-center w-full px-4'>
                <h1 className='text-2xl font-medium antialiased leading-6 my-2'>Settings</h1>
                {/* PROFILE */}
                <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                    <h1 className='text-xl font-semibold'>Profile Picture</h1>
                    <div className='white-glassmorphism my-3 p-3 flex justify-between items-center w-full'>
                    <img src={profile?.avatar} alt='Profile Picture' width={50} height={50} className='rounded-full'/>
                    <form onSubmit={updatePPContent}>
                      <label className='inline-flex py-4 px-4 bg-indigo-600 rounded-xl'>{profileloading ? <Loading/> : "Change"}
                      <input
                        className='hidden absolute h-52 -left-96'
                        type="file"
                        name="Asset"
                        onChange={updatePPContent}
                      />
                    </label>
                    </form>
                    </div>
                </div>
                {/* BANNER */}
                <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                    <h1 className='text-xl font-semibold'>Banner Picture</h1>
                    <div className='white-glassmorphism my-3 p-3 flex justify-between items-center w-full'>
                    <img src={profile?.banner} alt='Banner Picture' width={100} height={100} className='rounded-xl'/>
                    <form onSubmit={updateBannerContent}>
                      <label className='inline-flex py-4 px-4 bg-indigo-600 rounded-xl'>{bannerloading ? <Loading/> : "Change"}
                      <input
                        className='hidden absolute h-52 -left-96'
                        type="file"
                        name="Asset"
                        onChange={updateBannerContent}
                      />
                    </label>
                    </form>
                    </div>
                </div>
                {/* DESCRIPTION */}
                <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                    <h1 className='text-xl font-semibold'>Description</h1>
                    <div className='white-glassmorphism my-3 p-3 flex items-center w-full gap-x-3'>
                      <textarea
                      className='p-3 white-glassmorphism w-full'
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={profile?.description}/>
                      <button type='button' onClick={updateContent} className='flex justify-center items-center py-4 px-4 bg-indigo-600 rounded-xl'>Change</button>
                    </div>
                </div>
                {/* INSTAGRAM */}
                <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                    <h1 className='text-xl font-semibold'>Instagram</h1>
                    <div className='white-glassmorphism my-3 p-3 flex items-center w-full gap-x-3'>
                      <input
                      className='px-3 white-glassmorphism w-full py-2'
                      onChange={(e) => setInstagramLink(e.target.value)}
                      placeholder={profile?.instagram}/>
                      <button type='button' onClick={updateInstagram} className='flex justify-center items-center py-4 px-4 bg-indigo-600 rounded-xl'>Change</button>
                    </div>
                </div>
                {/* TWITTER */}
                <div className='white-glassmorphism w-full p-3 my-3 flex flex-col'>
                    <h1 className='text-xl font-semibold'>Twitter</h1>
                    <div className='white-glassmorphism my-3 p-3 flex items-center w-full gap-x-3'>
                      <input
                      className='px-3 white-glassmorphism w-full py-2'
                      onChange={(e) => setTwitterLink(e.target.value)}
                      placeholder={profile?.twitter}/>
                      <button type='button' onClick={updateTwitter} className='flex justify-center items-center py-4 px-4 bg-indigo-600 rounded-xl'>Change</button>
                    </div>
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

export default Settings;
export const getServerSideProps = async (context) => {
  const res = await fetch(`https://testnet.cos-in.com/api/users`)
  const userData = await res.json();

  return{
      props:{
          userData,
      }
  }
}