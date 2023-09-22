import React,{useContext,useState,useEffect, Fragment} from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import jwt from "jsonwebtoken";
import Cookies from 'js-cookie';
import { DataContext } from '../store/GlobalState'
import { postData } from "../utils/fetchData";
import Media from "react-media";
import { login } from "@/utils/firebase";
import Input from "@/components/Input";
import { useDispatch,useSelector } from "react-redux";
import { setUser } from "@/slice/auth";
import { PreLoader } from "@/components";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import frame1 from '@/images/frame1.png'
import frame2 from '@/images/frame2.png'
import frame3 from '@/images/frame3.png'
import { AiFillStar } from 'react-icons/ai'
import { BsCheckLg,BsChevronLeft,BsChevronRight } from 'react-icons/bs';
import logo from '@/images/logo.png'
import Image from "next/image";
import loginunder from '@/public/loginunderline.png'
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { authorization } from "@/utils/firebase";
import { RecaptchaVerifier,signInWithPhoneNumber } from 'firebase/auth';
import { Loading } from "@nextui-org/react";
import { toast } from "react-toastify";
import valid from "@/utils/valid";
import Head from 'next/head';

const Login = () => {

  const [enabled,setEnabled] = useState(false);
  const [loading,setLoading] = useState(false);
  const [logindata,setLoginData] = useState(null);
  const [usera,setUsera] = useState([]);

  const dispatcho = useDispatch()

  const initialState = {email:'',password:''}
  const [userData, setUserData] = useState(initialState)
  const {email,sms,password} = userData
  const {state,dispatch} = useContext(DataContext)
  const { auth } = state
  const router = useRouter();

  const [selectedAddress,setSelectedAddress] = useState(null);
  const [nowallet,setNoWallet] = useState(false);
  const addrs = window?.ethereum?.selectedAddress;

  useEffect(() => {
    getUsers()
  },[])

  const getUsers = async () => {
    await fetch('/api/api/users').then(res => {
      if(!res.ok){
        throw new Error("HTTP ERROR",res.status)
      }
      return res
    }).then(res => res.json()).then(data => {
      setUsera(data)
    })
  }

  const handleChangeInput = e => {
    const {name,value} = e.target
    setUserData({...userData,[name]:value})
    if(userData.email && userData.password){
      setEnabled(true)
    }
    dispatch({ type: 'NOTIFY', payload: {} })
   }


  const loginHandler = async (e) => {
    e.preventDefault();
    const {email,password} = userData;
 
    if(usera.find(u => u.email == email)){
    
    const data = {
      email:email,
      password:`${password}`,
    }

    dispatcho(setUser({
      email,
    }))

    
    if(!addrs){
      setNoWallet(true)
      // connectUser()
    }else if (addrs){
      const walletadd = window?.ethereum?.selectedAddress;
      setSelectedAddress(walletadd)
    }else{
      console.log("Please download any crypto wallet!")
    }

    // const reso = await login(email,password)
    // console.log("resofire",reso)

    // const res = await postData('login',data)
    // console.log("res",res)

    let resclone;
    const res = await fetch(`/api/api/login`,{
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
      
      const reso = await login(email,password)
    // console.log("fire",reso)
  
    setLoading(false)
    // router.push('/login')

  
    if(data.msg == "Login Success"){

      dispatch({ type: 'AUTH', payload: {
        token: data.accessToken,
        user: data.user
      }});
      
      Cookies.set('refreshtoken', data.refreshtoken, {
        path: 'api/accessToken',
        expires: 7
      });
      
      localStorage.setItem('firstLogin', true);
      const token = Cookies.get('refreshtoken');
      const decodedToken = jwt.decode(token);

      if(token && token !== undefined){
        toast.success("Login Successfull")
        router.push('/')
      }else{
        toast.error("Login not success!")
        router.push('/register')
      }

    }
  },(reject) => {
    console.log('Error parsing JSON from response:', reject, resclone);
    resclone.text().then((bodytext) => {
      console.log('Received the following instead of valid JSON:', bodytext);
    })
  })
      
    }else{
      toast.error("User not found")
      router.push('/login')
    }
  };

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

    if (token && token !== undefined) {
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
        <title>Login • Cosmeta NFT Marketplace</title>
        </Head>
        <div className=" text-slate-400 pt-20">
        <div className="absolute top-10 left-10">
        <Image src={logo} alt="Cosmeta INC" width={250} height={25} />
        </div>
        <div className="flex justify-end items-center w-full">
        <div className="flex-col z-40 justify-end items-center w-[500px] rounded-lg p-7 bg-gradient-to-tr to-slate-600 from-slate-900 text-slate-400 scale-75">
        <div className="justify-center items-center w-full text-center my-2 antialiased">
        <div className="flex justify-center items-center w-full gap-x-6">
        <h2 className="text-xl font-bold">Login</h2>
        </div>
        <div className="my-3">
        <h1 className="text-sm font-normal text-[#B6B6B6]">Please enter your details.</h1>
        </div>
    
        </div>
        
        <div className="grid grid-row-3 justify-center items-center mb-10">


        <form onSubmit={loginHandler}>
        <Input type="text" value={email} name="email" id="email" onChange={handleChangeInput} label="Email"/>
        <Input type="password" value={password} name="password" id="password" onChange={handleChangeInput} label="Password"/>
    
        <button type="submit" disabled={userData.email && userData.password ? false : true} className="w-80 disabled:opacity-25 disabled:cursor-not-allowed bg-gradient-to-tr to-slate-800 from-blue-600 text-slate-400 my-2 py-2 rounded-lg hover:to-blue-900 hover:from-teal-600">Login</button>
        <div className="text-center relative flex justify-center items-center w-full mt-5">
        <span>I don't have an account yet <Link href="/register"><strong>Register</strong></Link></span>
        <Image src={loginunder} className="absolute ml-52 mt-10"/>
        </div>
        </form>

        </div>
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
        <title>Login • Cosmeta NFT Marketplace</title>
        </Head>

    <div className="flex justify-between items-center w-full">
    <div className="absolute top-10 left-10">
    <Image src={logo} alt="Cosmeta INC" width={250} height={25} />
    </div>
    <div className="flex justify-end items-center w-full">
    <div className="flex-col z-40 justify-end items-center w-[500px] rounded-lg p-7 bg-gradient-to-tr to-slate-600 from-slate-900 text-slate-400 scale-75">
    <div className="justify-center items-center w-full text-center my-2 antialiased">
    <div className="flex justify-center items-center w-full gap-x-6">
    <h2 className="text-xl font-bold">Login</h2>

    </div>
    <div className="my-3">
    <h1 className="text-sm font-normal text-[#B6B6B6]">Please enter your details.</h1>
    </div>

    </div>
    
    <div className="grid grid-row-3 justify-center items-center mb-10">


    <form onSubmit={loginHandler}>
    <Input type="text" value={email} name="email" id="email" onChange={handleChangeInput} label="Email"/>
    <Input type="password" value={password} name="password" id="password" onChange={handleChangeInput} label="Password"/>

    <button type="submit" disabled={userData.email && userData.password ? false : true} className="w-80 disabled:opacity-25 disabled:cursor-not-allowed bg-gradient-to-tr to-slate-800 from-blue-600 text-slate-400 my-2 py-2 rounded-lg hover:to-blue-900 hover:from-teal-600">Login</button>
    <div className="text-center relative flex justify-center items-center w-full mt-5">
    <span>I don't have an account yet <Link href="/register"><strong>Register</strong></Link></span>
    <Image src={loginunder} className="absolute ml-52 mt-10"/>
    </div>
    </form>

    </div>
    </div>
    </div>
    <div className="flex relative justify-end items-center w-full py-5 px-6 ">
    <Link href='/register' className="w-[130px] h-[40px] cursor-pointer absolute z-[99] top-14 right-14 rounded-full bg-[#242424] flex justify-center items-center font-semibold text-slate-50">
    Register
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
    <div className="absolute top-0 left-0 bg-gradient-to-t to-transparent from-black z-[999] h-screen w-full rounded-xl">
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
    <div className="w-[500px] h-screen overflow-hidden rounded-xl">
    <Image src={frame3} width={500} className="object-cover w-[500px] h-screen"/>
    </div>

    </Carousel>
    </div>
</div>

    </div>
        </Fragment>
      }

      {matches.large && 
        <Fragment>
        <Head>
        <title>Login • Cosmeta NFT Marketplace</title>
        </Head>
    <div className="flex justify-between items-center w-full">
    <div className="absolute top-10 left-10">
    <Image src={logo} alt="Cosmeta INC" width={250} height={25} />
    </div>
    <div className="flex justify-end items-center w-full">
    <div className="flex-col z-40 justify-end items-center w-[500px] rounded-lg p-7 bg-gradient-to-tr to-slate-600 from-slate-900 text-slate-400">
    <div className="justify-center items-center w-full text-center my-2 antialiased">
    <div className="flex justify-center items-center w-full gap-x-6">
    <h2 className="font-bold text-xl">Login</h2>
    </div>
    <div className="my-3">
    <h1 className="text-sm font-normal text-[#B6B6B6]">Please enter your details.</h1>
    </div>

    </div>
    
    <div className="grid grid-row-3 justify-center items-center mb-10">
    <form onSubmit={loginHandler}>
    <Input type="text" value={email} name="email" id="email" onChange={handleChangeInput} label="Email"/>
    <Input type="password" value={password} name="password" id="password" onChange={handleChangeInput} label="Password"/>

    <button type="submit" disabled={userData.email && userData.password ? false : true} className="w-80 disabled:opacity-25 disabled:cursor-not-allowed bg-gradient-to-tr to-slate-800 from-blue-600 text-slate-400 my-2 py-2 rounded-lg hover:to-blue-900 hover:from-teal-600">Login</button>
    <div className="text-center relative flex justify-center items-center w-full mt-5">
    <span>I don't have an account yet <Link href="/register"><strong>Register</strong></Link></span>
    <Image src={loginunder} className="absolute ml-52 mt-10"/>
    </div>
    </form> 

    </div>
    </div>
    </div>
    <div className="flex relative justify-end items-center w-full py-5 px-6 ">
    <Link href='/register' className="w-[130px] h-[40px] cursor-pointer absolute z-[99] top-14 right-14 rounded-full bg-[#242424] flex justify-center items-center font-semibold text-slate-50">
    Register
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
        </Fragment>
      }

    </Fragment>
    )}
    </Media>
    </div>
  );
};

export default Login;

