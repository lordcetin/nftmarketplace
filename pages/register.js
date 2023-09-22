/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment } from "react";
import { useState,useContext,useEffect } from "react";
//import { AuthContext } from "../context/AuthContext";
//import { useForm } from "../utils/hooks";
//import { useMutation } from "@apollo/react-hooks";
//import { gql } from "apollo-server-micro";
import { useRouter } from "next/router";
import { register } from "@/utils/firebase";
import {TiTick} from 'react-icons/ti';
import valid from "../utils/valid";
import { useStateContext } from "../context/StateContext";
import { DataContext } from '../store/GlobalState'
import {postData} from '../utils/fetchData'
import Image from "next/image";
import giphy from '../images/giphy.gif'
import Media from "react-media";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import frame1 from '@/images/frame1.png'
import frame2 from '@/images/frame2.png'
import frame3 from '@/images/frame3.png'
import { AiFillStar } from 'react-icons/ai'
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { BsCheckLg,BsChevronLeft,BsChevronRight } from 'react-icons/bs';
import logo from '@/images/logo.png'
import Link from "next/link";
import { authorization } from "@/utils/firebase";
import { RecaptchaVerifier,signInWithPhoneNumber} from 'firebase/auth';
import Cookies from 'js-cookie';
import jwt from "jsonwebtoken";
import { Checkbox, Loading } from "@nextui-org/react";
import CustomButton from '@/components/CustomButton';
import { toast } from "react-toastify";
import Input from "@/components/Input";
import Head from 'next/head';

const Register = () => {

    const {user,getUser,connectUser,} = useStateContext();
    const {state,dispatch} = useContext(DataContext)
    const {auth} = state
    const [phone,setPhone] = useState('');
    const [showotp,setOtp] = useState(false);
    const [loading,setLoading] = useState(false);
    const [users,setUser] = useState([]);
    const [selectedAddress,setSelectedAddress] = useState(`${user}`);
    const [nowallet,setNoWallet] = useState(false);

    const router = useRouter();
    //const [success,setSuccess] = useState(false);
    // const context = useContext(AuthContext);
    // const [errors,setErrors] = useState([]);
    const initialState = {username: '',email:'',phone:`${phone}`,sms:'',password:'',confPass:'',walletAddress:`${selectedAddress}`,description:''}
    const [userData, setUserData] = useState(initialState)

    const {username,email,sms,password,confPass,walletAddress,description} = userData
    const addrs = window?.ethereum?.selectedAddress;
    const handleChangeInput = e => {
     const {name,value} = e.target
     setUserData({...userData,description,[name]:value})
     
    }
    // function registerUserCallback(){
    //   console.log("Callback hit");
    //   registerUser();
    // }

    // const { onChange,onSubmit,values } = useForm(registerUserCallback,{
    //   username: '',
    //   email: '',
    //   password: '',
    //   confirmPassword: '',
    // })

    // const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    //   update(proxy, { data: { registerUser: userData } }){
    //     context.login(userData);
    //     setUid(uniqid());
    //     setSuccess(true)
    //     router.push('/');
    //   },
    //   onError({ graphQLErrors }){
    //     setErrors(graphQLErrors);
    //   },
    //   variables: { registerInput: values }
    // });

    // require('dotenv').config();
    // const mongodb = process.env.MONGO_API;

    // async function createAccount(){
    //   const username = document.querySelector("[name=username]").value.toString()
    //   const email = document.querySelector("[name=email]").value.toString()
    //   const password = document.querySelector("[name=password]").value.toString()
    //   const confirmPassword = document.querySelector("[name=confirmPassword]").value.toString()
    //   var encryptedPassword = await bcrypt.hash(password, 10);
    //   var encryptedConfirmPassword = await bcrypt.hash(confirmPassword, 10);
    //   axios.post('https://data.mongodb-api.com/app/data-ocmyr/endpoint/data/v1/action/insertOne', {
    //   collection: 'users',
    //   database: 'cosdb',
    //   dataSource: 'Cluster0',
    //   document:{
    //     username: username,
    //     email: email,
    //     password: encryptedPassword,
    //     confirmPassword: encryptedConfirmPassword,
    //     }
    //   },
    //   {
    //     "Content-Type" : "application/json",
    //     "api-key" : mongodb,
    //   }).catch((error) => {
    //     console.log('Call failed: '+ error)
    //   })
    //   setSuccess(true)
    //   let displaysuccess = "Account Created Succesfully";
    //   document.getElementById("displayresult1").innerHTML = displaysuccess
    // }



  // implementation of newMealHandler function

  const onCaptcha = async () => {

    if(!window.recaptchaVerifier){
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                onSignup()
            },
            'expired-callback': () => {
              // Response expired. Ask user to solve reCAPTCHA again.
              // ...
            }
          }, authorization);
    }
  }

  const registerHandler = async (e) => {

      e.preventDefault();
      setLoading(true)

    const errMsg = valid(username, email, password, confPass)
    if(errMsg){
      toast.error(errMsg)
    }else{
    
    if(!addrs){
        setNoWallet(true)
        // connectUser()
    }else if (addrs){
      // connectUser()
      const walletadd = window?.ethereum?.selectedAddress;
      setSelectedAddress(walletadd)
      onSignup()
    }else{
      console.log("Please download any crypto wallet!")
    }
      
    }

  }

  const onSignup = async () => {

    onCaptcha()

    const appVerifier = window.recaptchaVerifier
    const formatphone = '+' + phone

    signInWithPhoneNumber(authorization, formatphone, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;

      setDatabase()

    }).catch((error) => {
        console.log(error)
        setLoading(false)
    });


  }
    
  const onOTPVerify = async () => {

      
    setLoading(true)
    window.confirmationResult.confirm(sms).then((res) => {
        // console.log("confirmationResult",res)
        setUser(res.user)

          toast.success("Register Successfull")
          router.push('/login')

    }).catch((err) => {
        console.log(err)
        toast.error(err)
        setLoading(false)
    })
          
}

const setDatabase = async () => {

  const data = {
    username:userData.username,
    email:userData.email,
    sms:`${sms}`,
    confPass:`${userData.confPass}`,
    description:'Write something about your NFTs and about yourself.',
    phone:`${phone}`,
    walletAddress:selectedAddress,
    password:`${password}`
  }
  // console.log("data",data)
  // console.log("datatype" , typeof data,data)

  let resclone;
  const res = await fetch(`http://localhost:3000/api/register`,{
    method: 'POST',
    headers:{
        'Content-Type': 'aplication/json',
    },
  body:JSON.stringify(data)
  }).then((res) => {
    resclone = res.clone()
    return res.json()
  }).then(async (data) => {
    // console.log("data",data)

    const formatphone = '+' + phone
    
  const fire = await register({username:userData.username,email:userData.email,phone:formatphone,password:userData.password})
  // console.log("fire",fire)

  setLoading(false)
  // router.push('/login')

  if(data.msg == "Register Success!" && fire.uid){
    setOtp(true)
  }
},(reject) => {
  console.log('Error parsing JSON from response:', reject, resclone);
  resclone.text().then((bodytext) => {
    console.log('Received the following instead of valid JSON:', bodytext);
  })
})



}

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1 
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 
    }
  };
  const CustomLeftArrow = ({ onClick }) => {
    return <button type='button' onClick={() => onClick()} className="custom-left-arrow p-5 rounded-full bg-slate-50 absolute left-4 shadow-2xl shadow-slate-800" ><BsChevronLeft size={22} className="text-slate-900"/></button>;
  };
  const CustomRightArrow = ({ onClick }) => {
    return <button type='button' onClick={() => onClick()} className="custom-right-arrow p-5 rounded-full bg-slate-50 absolute right-4 shadow-2xl shadow-slate-800" ><BsChevronRight size={22} className="text-slate-900"/></button>;
  };

  useEffect(() => {

    const token = Cookies.get('refreshtoken');
    const decodedToken = jwt.decode(token);
    const expr = decodedToken?.exp * 1000 > Date.now()

    if (token) {
      router.push('/')
    }

  }, [auth.user, router]);

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
      <title>Register • Cosmeta NFT Marketplace</title>
      </Head>

      <div className="py-40 h-screen text-slate-400 px-7">

      <div className="py-7 justify-center items-center w-full rounded-xl bg-gradient-to-tr to-slate-600 from-slate-900 text-slate-400 overflow-hidden scale-75">
      <div className="justify-center items-center w-full text-center my-2 antialiased">
      <h2 className="font-medium text-2xl">REGISTER</h2>
      <p className="font-light text-xl">Create a new account!</p>
      </div>
      
      <div className="flex-col justify-center items-center my-10 px-10 ">
      {showotp ?
        <div className="flex justify-center items-center w-full">
            <input type="text" onChange={handleChangeInput} value={sms} name="sms" id="sms" placeholder="SMS Code" className="w-96 bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 "/>
        </div>
        :<Fragment>
        <label htmlFor="Username"><input onChange={handleChangeInput} type="text" value={username} name="username" id="username" autoCorrect="off" autoComplete="off" placeholder="Username"  className="w-96 bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 " /></label>
        <label htmlFor="Email"><input onChange={handleChangeInput} type="email" value={email} name="email" id="email" placeholder="E-mail"  className="w-96 bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 "/></label>
        <div className="my-2">
        <PhoneInput country={"us"} value={phone} name="phone" onChange={setPhone}  buttonClass="!bg-slate-800 !rounded-l-lg !outline-none !border-none" dropdownClass="!bg-slate-800 !text-white !active:bg-slate-800" />
        </div>
        <label htmlFor="Password"><input onChange={handleChangeInput} type="password" value={password} name="password" id="password" placeholder="Password"  className="w-96 bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 "/></label>
        <label htmlFor="confirmPassword"><input onChange={handleChangeInput} type="password" value={confPass} name="confPass" id="confPass"  placeholder="Confirm Password" className="w-96 bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 "/></label>
        </Fragment>
    }
    <div className="flex justify-center items-center w-full gap-x-2 my-2">
    <Checkbox color="gradient"/>
    <span className="text-xs">Yes, I understand and agree to the stanley <a href="#">Terms of Service</a></span>
    </div>
    {showotp ?
      <button onClick={onOTPVerify} className="bg-gradient-to-tr to-slate-800 from-blue-600 text-slate-400 my-2 py-2 rounded-lg hover:to-blue-900 hover:from-teal-600 w-96">Register</button>
      : <button onClick={registerHandler} disabled={userData.email && userData.password && userData.username && userData.confPass ? false : true} className="disabled:opacity-20 disabled:cursor-not-allowed bg-gradient-to-tr to-slate-800 from-blue-600 text-slate-400 my-2 py-2 rounded-lg hover:to-blue-900 hover:from-teal-600 w-96">{loading ? <Loading size="xs" color="primary"/> : null} {loading ? "Sending SMS" : "Submit" }</button>
    }
      </div>
      </div>
      <div className="flex justify-center items-center w-full mt-10">

      <div className="w-[346px] rounded-xl">
      <Carousel
      additionalTransfrom={0}
      autoPlaySpeed={8000}
      autoPlay={true}
      centerMode={false}
      className="overflow-hidden"
      containerClass="carousel-container"
      customRightArrow={<CustomRightArrow />}
      customLeftArrow={<CustomLeftArrow />}
      dotListClass=""
      draggable={true}
      focusOnSelect={false}
      itemClass="carousel-item"
      minimumTouchDrag={80}
      pauseOnHover
      renderArrowsWhenDisabled={false}
      renderButtonGroupOutside
      renderDotsOutside={false}
      rewind={false}
      rewindWithAnimation={false}
      rtl={false}
      shouldResetAutoplay
      showDots={false}
      sliderClass=""
      slidesToSlide={1}
      swipeable
      responsive={responsive}
      ssr={true}
      infinite={true}
      keyBoardControl={true}
      transitionDuration={800}
      removeArrowOnDeviceType={["tablet", "mobile"]}>
      <div className="w-[346px] h-screen overflow-hidden rounded-xl">
      <div className="absolute bottom-0 bg-gradient-to-t to-transparent from-black z-[9999] w-full h-[455px]">
          <div className="absolute bottom-0 w-full h-[150px] flex-col grid justify-center items-center text-center">
              <p className="w-[300px] text-sm">“We move 10x faster than our peers and stay consistent. While they're bogged down with design debt, we're releasing new features.”</p>
              <div className="flex justify-between items-center w-full">
                  <div className="flex-col grid justify-start items-center">
                      <h1 className="text-2xl">Sophie Hall</h1>
                      <p>Design Agency</p>
                  </div>
                  <div className="flex justify-end items-center">
                      <AiFillStar/>
                      <AiFillStar/>
                      <AiFillStar/>
                      <AiFillStar/>
                      <AiFillStar/>
                  </div>
              </div>
          </div>
      </div>
      <Image src={frame1} width={746} className="object-cover w-full h-screen"/>
      </div>
      <div className="w-[346px] h-screen overflow-hidden rounded-xl">
      <div className="absolute bottom-0 bg-gradient-to-t to-transparent from-black z-[9999] w-full h-[455px]">
      <div className="absolute bottom-0 w-full h-[150px] flex-col grid justify-center items-center text-center">
          <p className="w-[300px] text-sm">“We move 10x faster than our peers and stay consistent. While they're bogged down with design debt, we're releasing new features.”</p>
          <div className="flex justify-between items-center w-full mt-4">
              <div className="flex-col grid justify-start items-center">
                  <h1 className="text-2xl">Ellen Richardson</h1>
                  <p>Photographer</p>
              </div>
              <div className="flex justify-end items-center">
                  <AiFillStar/>
                  <AiFillStar/>
                  <AiFillStar/>
                  <AiFillStar/>
                  <AiFillStar/>
              </div>
          </div>
      </div>
      </div>
      <Image src={frame2} width={746} className="object-cover w-full h-screen"/>
      </div>
      <div className="w-[346px] h-screen overflow-hidden rounded-xl">
      <Image src={frame3} width={746} className="object-cover w-full h-screen"/>
      </div>

      </Carousel>
      </div>
  </div>
      </div>

      </Fragment>
      }
      {matches.medium &&
        <Fragment>
        <Head>
        <title>Register • Cosmeta NFT Marketplace</title>
        </Head>
        <div className=" text-slate-900">
          <div className="absolute top-10 left-10">
          <Image src={logo} alt="Cosmeta INC" width={250} height={25} />
          </div>
        <div className="flex justify-between items-center w-full">
  
          <div className="flex justify-end items-center w-full">
          <div className="p-7 justify-center items-center w-[500px] scale-75 rounded-xl border-slate-800 bg-gradient-to-tr to-slate-600 from-slate-900 text-slate-400 overflow-hidden">
          <div className="justify-center items-center w-full text-center my-2 antialiased">
          <h2 className="font-medium text-2xl">REGISTER</h2>
          <p className="font-light text-xl">Create a new account!</p>
          </div>
          
          <div className="grid grid-row-3 justify-center items-center my-10 px-10">
          {/*<form method="post" onSubmit={onSignup}>*/}
  
          <div id="recaptcha-container"></div>
          {/*<input type="text" onChange={handleChangeInput} value={phone} name="phone" id="phone" placeholder="Phone Number" className="outline-none border border-slate-400 focus:border-orange-500 text-slate-50 rounded-full h-[50px] w-full px-6 bg-transparent"/>*/}
          {showotp ?
              <div className="flex justify-center items-center w-full">
                  <input type="text" onChange={handleChangeInput} value={sms} name="sms" id="sms" placeholder="SMS Code" className="w-96 bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 "/>
              </div>
              :<Fragment>
              <label htmlFor="Username"><input onChange={handleChangeInput} type="text" value={username} name="username" id="username" autoCorrect="off" autoComplete="off" placeholder="Username"  className="w-96 bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 " /></label>
              <label htmlFor="Email"><input onChange={handleChangeInput} type="email" value={email} name="email" id="email" placeholder="E-mail"  className="w-96 bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 "/></label>
              <div className="my-2">
              <PhoneInput country={"us"} value={phone} name="phone" onChange={setPhone}  buttonClass="!bg-slate-800 !rounded-l-lg !outline-none !border-none" dropdownClass="!bg-slate-800 !text-white !active:bg-slate-800" />
              </div>
              <label htmlFor="Password"><input onChange={handleChangeInput} type="password" value={password} name="password" id="password" placeholder="Password"  className="w-96 bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 "/></label>
              <label htmlFor="confirmPassword"><input onChange={handleChangeInput} type="password" value={confPass} name="confPass" id="confPass"  placeholder="Confirm Password" className="w-96 bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 "/></label>
              </Fragment>
          }
          <div className="flex justify-center items-center w-full gap-x-2 my-2">
          <Checkbox color="gradient"/>
          <span className="text-xs">Yes, I understand and agree to the stanley <a href="#">Terms of Service</a></span>
          </div>
          {showotp ?
            <button onClick={onOTPVerify} className="bg-gradient-to-tr to-slate-800 from-blue-600 text-slate-400 my-2 py-2 rounded-lg hover:to-blue-900 hover:from-teal-600 w-96">Register</button>
            : <button onClick={registerHandler} disabled={userData.email && userData.password && userData.username && userData.confPass ? false : true} className="disabled:opacity-20 disabled:cursor-not-allowed bg-gradient-to-tr to-slate-800 from-blue-600 text-slate-400 my-2 py-2 rounded-lg hover:to-blue-900 hover:from-teal-600 w-96">{loading ? <Loading size="xs" color="primary"/> : null} {loading ? "Sending SMS" : "Submit" }</button>
          }
         {/* </form>*/}
          </div>
          </div>
          </div>
  
          <div className="flex relative justify-end items-center w-full py-5 px-6 ">
          <Link href='/login' className="w-[130px] h-[40px] cursor-pointer absolute z-[99] top-14 right-14 rounded-full bg-[#242424] flex justify-center items-center font-semibold text-slate-50">
          Log In
          </Link>
          <div className="w-[500px] rounded-xl">
          <Carousel
          additionalTransfrom={0}
          autoPlaySpeed={8000}
          autoPlay={true}
          centerMode={false}
          className="overflow-hidden"
          containerClass="carousel-container"
          customRightArrow={<CustomRightArrow />}
          customLeftArrow={<CustomLeftArrow />}
          dotListClass=""
          draggable={true}
          focusOnSelect={false}
          itemClass="carousel-item"
          minimumTouchDrag={80}
          pauseOnHover
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside
          renderDotsOutside={false}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          showDots={false}
          sliderClass=""
          slidesToSlide={1}
          swipeable
          responsive={responsive}
          ssr={true}
          infinite={true}
          keyBoardControl={true}
          transitionDuration={800}
          removeArrowOnDeviceType={["tablet", "mobile"]}>
          <div className="w-[500px] h-screen overflow-hidden rounded-xl">
          <div className="absolute top-0 left-0 bg-gradient-to-t to-transparent from-black z-[9999] h-screen w-full rounded-xl">
              <div className="absolute bottom-10 w-full h-[300px] flex-col grid justify-center items-center text-center">
                  <p className="w-[350px] text-3xl">“We move 10x faster than our peers and stay consistent. While they're bogged down with design debt, we're releasing new features.”</p>
                  <div className="flex justify-between items-center w-full">
                      <div className="flex-col grid justify-start items-center">
                          <h1 className="text-2xl">Sophie Hall</h1>
                          <p>Design Agency</p>
                      </div>
                      <div className="flex justify-end items-center">
                          <AiFillStar/>
                          <AiFillStar/>
                          <AiFillStar/>
                          <AiFillStar/>
                          <AiFillStar/>
                      </div>
                  </div>
              </div>
          </div>
          <Image src={frame1} width={500} className="object-cover w-[500px] h-screen"/>
          </div>
          <div className="w-[500px] h-screen overflow-hidden rounded-xl">
          <div className="absolute top-0 left-0 bg-gradient-to-t to-transparent from-black z-[9999] h-screen w-full rounded-xl">
          <div className="absolute bottom-10 w-full h-[300px] flex-col grid justify-center items-center text-center">
              <p className="w-[350px] text-3xl">“We move 10x faster than our peers and stay consistent. While they're bogged down with design debt, we're releasing new features.”</p>
              <div className="flex justify-between items-center w-full">
                  <div className="flex-col grid justify-start items-center">
                      <h1 className="text-2xl">Ellen Richardson</h1>
                      <p>Photographer</p>
                  </div>
                  <div className="flex justify-end items-center">
                      <AiFillStar/>
                      <AiFillStar/>
                      <AiFillStar/>
                      <AiFillStar/>
                      <AiFillStar/>
                  </div>
              </div>
          </div>
          </div>
          <Image src={frame2} width={500} className="object-cover w-[500px] h-screen"/>
          </div>
          <div className="w-[646px] h-screen overflow-hidden rounded-xl">
          <Image src={frame3} width={500} className="object-cover w-[500px] h-screen"/>
          </div>
  
          </Carousel>
          </div>
      </div>
  
        </div>
        </div>
        </Fragment>
      }
      {matches.large &&
      <Fragment>
      <Head>
      <title>Register • Cosmeta NFT Marketplace</title>
      </Head>

      <div className=" text-slate-900">
        <div className="absolute top-10 left-10">
        <Image src={logo} alt="Cosmeta INC" width={250} height={25} />
        </div>
      <div className="flex justify-between items-center w-full">

        <div className="flex justify-end items-center w-full">
        <div className="p-7 justify-center items-center w-[500px] rounded-xl border-slate-800 bg-gradient-to-tr to-slate-600 from-slate-900 text-slate-400 overflow-hidden">
        <div className="justify-center items-center w-full text-center my-2 antialiased">
        <h2 className="font-medium text-2xl">REGISTER</h2>
        <p className="font-light text-xl">Create a new account!</p>
        </div>
        
        <div className="grid grid-row-3 justify-center items-center my-10 px-10">
        {/*<form method="post" onSubmit={onSignup}>*/}

        <div id="recaptcha-container"></div>
        {/*<input type="text" onChange={handleChangeInput} value={phone} name="phone" id="phone" placeholder="Phone Number" className="outline-none border border-slate-400 focus:border-orange-500 text-slate-50 rounded-full h-[50px] w-full px-6 bg-transparent"/>*/}
        {showotp ?
          <div className="flex justify-center items-center w-full">
              <Input type="text" value={sms} name="sms" id="sms" onChange={handleChangeInput} label="SMS Code"/>
          </div>
          :<Fragment>
          {/*<label htmlFor="Username"><input onChange={handleChangeInput} type="text" value={username} name="username" id="username" autoCorrect="off" autoComplete="off" placeholder="Username"  className="w-96 bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 " /></label>*/}
          <Input type="text" value={username} name="username" id="username" onChange={handleChangeInput} label="Username" autoCorrect="off" autoComplete="off"/>
          {/*<label htmlFor="Email"><input onChange={handleChangeInput} type="email" value={email} name="email" id="email" placeholder="E-mail"  className="w-96 bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 "/></label>*/}
          <Input type="email" value={email} name="email" id="email" onChange={handleChangeInput} label="Email" autoCorrect="off" autoComplete="off"/>
          <div className="my-2">
          <PhoneInput country={"us"} value={phone} name="phone" onChange={setPhone}  buttonClass="!bg-slate-800 !rounded-l-lg !outline-none !border-none" dropdownClass="!bg-slate-800 !text-white !active:bg-slate-800" />
          </div>
          {/*<label htmlFor="Password"><input onChange={handleChangeInput} type="password" value={password} name="password" id="password" placeholder="Password"  className="w-96 bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 "/></label>*/}
          <Input type="password" value={password} name="password" id="password" onChange={handleChangeInput} label="Password" autoCorrect="off" autoComplete="off"/>
          {/*<label htmlFor="confirmPassword"><input onChange={handleChangeInput} type="password" value={confPass} name="confPass" id="confPass"  placeholder="Confirm Password" className="w-96 bg-slate-800 my-2 py-2 px-4 rounded-lg text-slate-400 placeholder:text-slate-600 outline-none active:border-2 active:border-blue-500 focus:border-blue-500 border-2 border-transparent hover:border-2 hover:border-blue-500 "/></label>*/}
          <Input type="password" value={confPass} name="confPass" id="confPass" onChange={handleChangeInput} label="Confirm Password" autoCorrect="off" autoComplete="off"/>
          </Fragment>
      }
      <div className="flex justify-center items-center w-full gap-x-2 my-2">
      <Checkbox color="gradient"/>
      <span className="text-xs">Yes, I understand and agree to the stanley <a href="#">Terms of Service</a></span>
      </div>
      {showotp ?
        <button onClick={onOTPVerify} className="bg-gradient-to-tr to-slate-800 from-blue-600 text-slate-400 my-2 py-2 rounded-lg hover:to-blue-900 hover:from-teal-600 w-96">Register</button>
       : <button onClick={registerHandler} disabled={userData.email && userData.password && userData.username && userData.confPass ? false : true} className="disabled:opacity-20 disabled:cursor-not-allowed bg-gradient-to-tr to-slate-800 from-blue-600 text-slate-400 my-2 py-2 rounded-lg hover:to-blue-900 hover:from-teal-600 w-96">{loading ? <Loading size="xs" color="primary"/> : null} {loading ? "Sending SMS" : "Submit" }</button>
      }

       {/* </form>*/}
        </div>
        </div>
        </div>

        <div className="flex relative justify-end items-center w-full py-5 px-6 ">
        <Link href='/login' className="w-[130px] h-[40px] cursor-pointer absolute z-[99] top-14 right-14 rounded-full bg-[#242424] flex justify-center items-center font-semibold text-slate-50">
        Log In
        </Link>
        <div className="w-[646px] rounded-xl">
        <Carousel
        additionalTransfrom={0}
        autoPlaySpeed={8000}
        autoPlay={true}
        centerMode={false}
        className="overflow-hidden"
        containerClass="carousel-container"
        customRightArrow={<CustomRightArrow />}
        customLeftArrow={<CustomLeftArrow />}
        dotListClass=""
        draggable={true}
        focusOnSelect={false}
        itemClass="carousel-item"
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside
        renderDotsOutside={false}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
        responsive={responsive}
        ssr={true}
        infinite={true}
        keyBoardControl={true}
        transitionDuration={800}
        removeArrowOnDeviceType={["tablet", "mobile"]}>
        <div className="w-[646px] h-screen overflow-hidden rounded-xl">
        <div className="absolute top-0 left-0 bg-gradient-to-t to-transparent from-black z-[9999] h-screen w-full rounded-xl">
            <div className="absolute bottom-10 w-full h-[300px] flex-col grid justify-center items-center text-center">
                <p className="w-[500px] text-3xl">“We move 10x faster than our peers and stay consistent. While they're bogged down with design debt, we're releasing new features.”</p>
                <div className="flex justify-between items-center w-full">
                    <div className="flex-col grid justify-start items-center">
                        <h1 className="text-2xl">Sophie Hall</h1>
                        <p>Design Agency</p>
                    </div>
                    <div className="flex justify-end items-center">
                        <AiFillStar/>
                        <AiFillStar/>
                        <AiFillStar/>
                        <AiFillStar/>
                        <AiFillStar/>
                    </div>
                </div>
            </div>
        </div>
        <Image src={frame1} width={646} className="object-cover w-[646px] h-screen"/>
        </div>
        <div className="w-[646px] h-screen overflow-hidden rounded-xl">
        <div className="absolute top-0 left-0 bg-gradient-to-t to-transparent from-black z-[9999] h-screen w-full rounded-xl">
        <div className="absolute bottom-10 w-full h-[300px] flex-col grid justify-center items-center text-center">
            <p className="w-[500px] text-3xl">“We move 10x faster than our peers and stay consistent. While they're bogged down with design debt, we're releasing new features.”</p>
            <div className="flex justify-between items-center w-full">
                <div className="flex-col grid justify-start items-center">
                    <h1 className="text-2xl">Ellen Richardson</h1>
                    <p>Photographer</p>
                </div>
                <div className="flex justify-end items-center">
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiFillStar/>
                </div>
            </div>
        </div>
        </div>
        <Image src={frame2} width={646} className="object-cover w-[646px] h-screen"/>
        </div>
        <div className="w-[646px] h-screen overflow-hidden rounded-xl">
        <Image src={frame3} width={646} className="object-cover w-[646px] h-screen"/>
        </div>

        </Carousel>
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
    )
}

export default Register;
