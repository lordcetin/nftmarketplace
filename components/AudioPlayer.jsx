import React,{useState,useRef,useEffect, Fragment} from "react";
import styles from '../styles/AudioPlayer.module.css'
import Image from "next/image";
import Link from "next/link";
import Media from "react-media";
import {SiOpensea} from 'react-icons/si';
import { useStateContext } from "../context/StateContext";
//ICONS
import {AiFillPlayCircle,AiFillBackward,AiFillForward,AiFillPauseCircle} from 'react-icons/ai'

//EXTERNAL
import logo from '../public/logo.png';

const AudioPlayer = ({nft,nftcover,nftname,nftid,slidermode,detailpage}) => {
    const {nftcustom,user} = useStateContext();
    const [isPlaying,setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime,setCurrentTime] = useState(0);
    const [focus,setFocus] = useState(false)
    const audioPlayer = useRef();
    const progressBar = useRef();
    const animationRef = useRef();

    useEffect(() => {
        const seconds = Math.floor(audioPlayer.current.duration)
        setDuration(seconds)
        progressBar.current.max = seconds;
    },[audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState])

    const calculateTime = (secs) => {
        const minutes = Math.floor(secs/60);
        const returnMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(secs % 60)
        const returnedSecond = seconds < 10 ? `0${seconds}` : `${seconds}`
        return `${returnMinutes}`+':'+`${returnedSecond}`
    }

    const togglePlayPause = () => {
        const prevValue = isPlaying;

        setPlaying(!prevValue)
        if(!prevValue){
            audioPlayer.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying)
        }else{
            audioPlayer.current.pause();
            cancelAnimationFrame(animationRef.current);
        }
    }

    const whilePlaying = () => {
        progressBar.current.value = audioPlayer.current.currentTime;
        changePlayerCurrentTime()
        animationRef.current = requestAnimationFrame(whilePlaying)
    }

    const changeRange = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changePlayerCurrentTime()
    }

    const changePlayerCurrentTime = () => {
        progressBar.current.style.setProperty('--seek-before-width',`${progressBar.current.value / duration * 100}%`)
        setCurrentTime(progressBar.current.value);
    }

    const backthirty = () => {
        progressBar.current.value = Number(progressBar.current.value - 30);
        changeRange()
    }
    const forwardthirty = () => {
        progressBar.current.value = Number(progressBar.current.value + 30);
        changeRange()
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
            <div className="flex relative justify-center items-center w-full">
            <Link href={`/details/${nftid}`}>
            <img src={nftcover} alt="NFT Music Cover" 
            className={slidermode ? "w-screen h-[393px] object-cover z-10" 
            : detailpage ? "w-[300px] h-full object-cover rounded-xl" 
            : "w-full h-[296px] sm:h-[170px] object-cover"}/>
            </Link>
            <div className={slidermode ? "absolute top-2 left-2" : "absolute bottom-2 left-2"}>
            <audio ref={audioPlayer} src={nft} preload="metadata"/>
            <button className="hidden"><AiFillBackward size={22} className=" hover:text-blue-500" onClick={backthirty}/></button>
                <button onClick={togglePlayPause}>{isPlaying ? <div className="backdrop-blur-sm w-[50px] h-[50px] rounded-full"><AiFillPlayCircle size={50} className="hover:text-opacity-100 text-white text-opacity-50 animate-spin"/></div> : <div className="backdrop-blur-sm rounded-full w-[50px] h-[50px]"><AiFillPlayCircle size={50} className="hover:text-opacity-100 text-white text-opacity-50"/></div>}</button>
            <button className="hidden"><AiFillForward size={22} className=" hover:text-blue-500" onClick={forwardthirty}/></button>
            <div className=" justify-center text-sm items-center gap-x-2 hidden">
            <div><span className="text-[10px]">{calculateTime(currentTime)}</span></div>
            <div><input type="range" name="progressbar" id="progressbar" className={styles.progressBar} defaultValue="0" ref={progressBar} onChange={changeRange}/></div>
            <div><span className="text-[10px]">{(duration && !isNaN(duration)) && calculateTime(duration)}</span></div>
            </div>
            </div>
            </div>
            </Fragment>
        }

        {matches.medium &&
            <Fragment>
            <div className="flex relative justify-center items-center w-full">
            <Link href={`/details/${nftid}`}>
            <img src={nftcover} alt="NFT Music Cover"
            className={slidermode ? "w-screen h-[393px] object-cover z-10" 
            : detailpage ? "w-[300px] h-full object-cover rounded-xl" 
            : "w-full h-[296px] sm:h-[170px] object-cover"}/>
            </Link>
            <div className={slidermode ? "absolute top-2 left-2" : "absolute bottom-2 left-2"}>
            <audio ref={audioPlayer} src={nft} preload="metadata"/>
            <button className="hidden"><AiFillBackward size={22} className=" hover:text-blue-500" onClick={backthirty}/></button>
                <button onClick={togglePlayPause}>{isPlaying ? <div className="backdrop-blur-sm w-[50px] h-[50px] rounded-full"><AiFillPlayCircle size={50} className="hover:text-opacity-100 text-white text-opacity-50 animate-spin"/></div> : <div className="backdrop-blur-sm rounded-full w-[50px] h-[50px]"><AiFillPlayCircle size={50} className="hover:text-opacity-100 text-white text-opacity-50"/></div>}</button>
            <button className="hidden"><AiFillForward size={22} className=" hover:text-blue-500" onClick={forwardthirty}/></button>
            <div className=" justify-center text-sm items-center gap-x-2 hidden">
            <div><span className="text-[10px]">{calculateTime(currentTime)}</span></div>
            <div><input type="range" name="progressbar" id="progressbar" className={styles.progressBar} defaultValue="0" ref={progressBar} onChange={changeRange}/></div>
            <div><span className="text-[10px]">{(duration && !isNaN(duration)) && calculateTime(duration)}</span></div>
            </div>
            </div>
            </div>
            </Fragment>
        }

        {matches.large &&
    <Fragment>
    <div className="flex relative justify-center items-center w-full">
    <Link href={`/details/${nftid}`}>
    <img src={nftcover} alt="NFT Music Cover"
    className={slidermode ? "w-screen h-[393px] object-cover z-10" 
    : detailpage ? "w-[600px] h-full object-cover rounded-xl" 
    : "w-full h-[296px] sm:h-[170px] object-cover"}/>
    </Link>
    <div className={slidermode ? "absolute top-2 left-2" : "absolute bottom-2 left-2"}>
    <audio ref={audioPlayer} src={nft} preload="metadata"/>
    <button className="hidden"><AiFillBackward size={22} className=" hover:text-blue-500" onClick={backthirty}/></button>
        <button onClick={togglePlayPause}>{isPlaying ? <div className="backdrop-blur-sm w-[50px] h-[50px] rounded-full"><AiFillPlayCircle size={50} className="hover:text-opacity-100 text-white text-opacity-50 animate-spin"/></div> : <div className="backdrop-blur-sm rounded-full w-[50px] h-[50px]"><AiFillPlayCircle size={50} className="hover:text-opacity-100 text-white text-opacity-50"/></div>}</button>
    <button className="hidden"><AiFillForward size={22} className=" hover:text-blue-500" onClick={forwardthirty}/></button>
    <div className=" justify-center text-sm items-center gap-x-2 hidden">
    <div><span className="text-[10px]">{calculateTime(currentTime)}</span></div>
    <div><input type="range" name="progressbar" id="progressbar" className={styles.progressBar} defaultValue="0" ref={progressBar} onChange={changeRange}/></div>
    <div><span className="text-[10px]">{(duration && !isNaN(duration)) && calculateTime(duration)}</span></div>
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

export default AudioPlayer;
