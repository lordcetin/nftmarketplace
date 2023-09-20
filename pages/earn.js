import React from 'react';
import { Fragment } from "react";
import Media from "react-media";
import Head from 'next/head';
const Earn = () => {
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
            <title>EARN • Cosmeta NFT Marketplace</title>
            </Head>
            <div className="flex justify-center items-center w-full h-screen">
            <h1 className="flex justify-center items-center text-center text-xl">COMING SOON</h1>
            </div>
            </Fragment>
            }

            {matches.medium && 
            <Fragment>
            <Head>
            <title>EARN • Cosmeta NFT Marketplace</title>
            </Head>
            <div className="flex justify-center items-center w-full h-screen">
            <h1 className="flex justify-center items-center text-center text-xl">COMING SOON</h1>
            </div>
            </Fragment>
            }

            {matches.large && 
            <Fragment>
            <Head>
            <title>EARN • Cosmeta NFT Marketplace</title>
            </Head>
            <div className="flex justify-center items-center w-full h-screen">
            <h1 className="flex justify-center items-center text-center text-3xl">COMING SOON</h1>
            </div>
            </Fragment>
            }

        </Fragment>
        )}
      </Media>
    </div>
    );
};

export default Earn;
