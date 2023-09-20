import React from "react";
import {Text} from '@nextui-org/react';
import nftone from '../public/nft_1.png';
import Image from "next/image";
const Welcome = () => {
  return (
    <div>
        <div className="flex justify-center items-center w-full h-[780px]">
            <div className="flex justify-between items-center px-20">

                <div className="flex-col justify-start items-center w-full px-28">
                    <Text  h1 weight="bold" size={100} css={{textGradient: "45deg, $yellow600 -20%, $purple600 50%"}} className="w-[750px] relative">Discover</Text>
                    <Text  h1 weight="bold" size={45} css={{textGradient: "45deg, $purple600 20%, $yellow500 50%",}} className="w-[750px relative bottom-7">The latest lived Legend</Text>
                    <Text  h1 weight="bold" size={165} css={{textGradient: "45deg, $yellow500 20%, $red600 50%"}} className="w-[750px] relative bottom-24">NFTs</Text>
                </div>

                <div className="flex justify-end items-center w-full">
                <div className="flex justify-between items-center w-full animate-bounce">
                <Image src={nftone} alt="nft" width={700} height={800} className="object-cover z-20 rounded-xl shadow-md"/>
                <div className="w-[670px] h-[400px] bg-purple-500 rounded-xl z-10 relative right-72 bottom-5">
                </div>
                </div>
                </div>

            </div>
        </div>
    </div>);
};

export default Welcome;
