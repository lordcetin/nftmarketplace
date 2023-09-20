import React,{useState,useRef,useEffect, Fragment} from "react";
import styles from '../styles/AudioPlayer.module.css'
import Image from "next/image";
import Link from "next/link";
import Media from "react-media";
//ICONS
import {AiFillPlayCircle,AiFillBackward,AiFillForward,AiFillPauseCircle} from 'react-icons/ai'

//EXTERNAL
import logo from '../public/logo.png';

const AudioPlayer = ({nft,nftname,nftid}) => {

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
    <div className="flex justify-center items-center w-full z-10">
    <div className="flex-col justify-center items-center text-center">
    <div className="flex w-full pt-8">
    <Link href={`/details/${nftid}`}><div className="relative left-2 w-60 h-48 welcomebg rounded-lg shadow-2xl shadow-black z-50">
    <div className="flex-col justify-center items-center text-center overflow-hidden">
    <h1 className="flex justify-center items-center text-xl font-bold my-20">{nftname}</h1>
    <div className="relative bottom-3 left-3 flex w-24">
    <Image src={logo} alt="" width={800} className="absolute bottom-5 z-30" />
    </div>
    </div>
    </div>
    </Link>
    <img src="https://bafkreifdqokmzap5e5hjb7oz32mfg32lctsq4kizbzqzzv4xlpzyiuujsm.ipfs.nftstorage.link/" alt="" className={isPlaying ? `relative w-48 h-48 right-24 animate-spin`: `relative w-48 h-48 right-24`} />
    </div>
    </div>
    </div>
    <div className="flex justify-center items-center pt-6 pb-[14px] w-full">
    <div className="flex-col justify-center items-center text-center">
    <audio ref={audioPlayer} src={nft} preload="metadata"/>
    <div className="flex justify-between items-center w-full">
    <div className="flex items-center gap-x-1 w-full" >
    <button><AiFillBackward size={22} className=" hover:text-blue-500" onClick={backthirty}/></button>
    <button onClick={togglePlayPause}>{isPlaying ? <AiFillPauseCircle size={28} className="hover:text-blue-500"/> : <AiFillPlayCircle size={28} className="hover:text-blue-500"/>}</button>
    <button><AiFillForward size={22} className=" hover:text-blue-500" onClick={forwardthirty}/></button>
    </div>
    <div className="flex justify-center text-sm items-center gap-x-2">
    <div><span className="text-[10px]">{calculateTime(currentTime)}</span></div>
    <div><input type="range" name="progressbar" id="progressbar" className={styles.progressBar} defaultValue="0" ref={progressBar} onChange={changeRange}/></div>
    <div><span className="text-[10px]">{(duration && !isNaN(duration)) && calculateTime(duration)}</span></div>
    </div>
    </div>
    
    </div>
    </div>
    </Fragment>
        }

        {matches.medium &&
    <Fragment>
    <div className="flex justify-center items-center w-full">
    <div className="flex-col justify-center items-center text-center">
    <div className="flex w-full pt-8">
    <Link href={`/details/${nftid}`}><div className="relative left-2 w-60 h-48 welcomebg rounded-lg shadow-2xl shadow-black z-50">
    <div className="flex-col justify-center items-center text-center overflow-hidden">
    <h1 className="flex justify-center items-center text-xl font-bold my-20">{nftname}</h1>
    <div className="relative bottom-3 left-3 flex w-24">
    <Image src={logo} alt="" width={800} className="absolute bottom-5 z-30" />
    </div>
    </div>
    </div>
    </Link>
    <img src="https://bafkreifdqokmzap5e5hjb7oz32mfg32lctsq4kizbzqzzv4xlpzyiuujsm.ipfs.nftstorage.link/" alt="" className={isPlaying ? `relative w-48 h-48 right-24 z-30 animate-spin`: `relative w-48 h-48 right-24 z-30`} />
    </div>
    </div>
    </div>
    <div className="flex justify-center items-center pt-6 pb-[14px] w-full">
    <div className="flex-col justify-center items-center text-center">
    <audio ref={audioPlayer} src={nft} preload="metadata"/>
    <div className="flex justify-between items-center w-full">
    <div className="flex items-center gap-x-1 w-full" >
    <button><AiFillBackward size={22} className=" hover:text-blue-500" onClick={backthirty}/></button>
    <button onClick={togglePlayPause}>{isPlaying ? <AiFillPauseCircle size={28} className="hover:text-blue-500"/> : <AiFillPlayCircle size={28} className="hover:text-blue-500"/>}</button>
    <button><AiFillForward size={22} className=" hover:text-blue-500" onClick={forwardthirty}/></button>
    </div>
    <div className="flex justify-center text-sm items-center gap-x-2">
    <div><span className="text-[10px]">{calculateTime(currentTime)}</span></div>
    <div><input type="range" name="progressbar" id="progressbar" className={styles.progressBar} defaultValue="0" ref={progressBar} onChange={changeRange}/></div>
    <div><span className="text-[10px]">{(duration && !isNaN(duration)) && calculateTime(duration)}</span></div>
    </div>
    </div>
    
    </div>
    </div>
    </Fragment>
        }

        {matches.large &&
    <Fragment>
    <div className="flex justify-center items-center w-full">
    <div className="flex-col justify-center items-center text-center">
    <div className="flex w-full pt-8">
    <Link href={`/details/${nftid}`}><div className="relative left-2 w-60 h-48 welcomebg rounded-lg shadow-2xl shadow-black z-50">
    <div className="flex-col justify-center items-center text-center overflow-hidden">
    <h1 className="flex justify-center items-center text-xl font-bold my-20">{nftname}</h1>
    <div className="relative bottom-3 left-3 flex w-24">
    <Image src={logo} alt="" width={800} className="absolute bottom-5 z-30" />
    </div>
    </div>
    </div>
    </Link>
    <img src="https://bafkreifdqokmzap5e5hjb7oz32mfg32lctsq4kizbzqzzv4xlpzyiuujsm.ipfs.nftstorage.link/" alt="" className={isPlaying ? `relative w-48 h-48 right-24 z-30 animate-spin`: `relative w-48 h-48 right-24 z-30`} />
    </div>
    </div>
    </div>
    <div className="flex justify-center items-center pt-6 pb-[14px] w-full">
    <div className="flex-col justify-center items-center text-center">
    <audio ref={audioPlayer} src={nft} preload="metadata"/>
    <div className="flex justify-between items-center w-full">
    <div className="flex items-center gap-x-1 w-full" >
    <button><AiFillBackward size={22} className=" hover:text-blue-500" onClick={backthirty}/></button>
    <button onClick={togglePlayPause}>{isPlaying ? <AiFillPauseCircle size={28} className="hover:text-blue-500"/> : <AiFillPlayCircle size={28} className="hover:text-blue-500"/>}</button>
    <button><AiFillForward size={22} className=" hover:text-blue-500" onClick={forwardthirty}/></button>
    </div>
    <div className="flex justify-center text-sm items-center gap-x-2">
    <div><span className="text-[10px]">{calculateTime(currentTime)}</span></div>
    <div><input type="range" name="progressbar" id="progressbar" className={styles.progressBar} defaultValue="0" ref={progressBar} onChange={changeRange}/></div>
    <div><span className="text-[10px]">{(duration && !isNaN(duration)) && calculateTime(duration)}</span></div>
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

export default AudioPlayer;
