import React,{useState,useEffect, Fragment} from "react";
import Sidebar from "./components/sidebar";
import Inbox from "./inbox";
import Media from "react-media";
import Head from 'next/head';
const InboxLayout = () => {

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
				<title>Messages • Cosmeta NFT Marketplace</title>
				</Head>
					<div className="h-full py-20 pb-40">
					<div className="flex mx-auto border-2 my-10 border-slate-800 rounded-md h-[calc(100vh-150px)] w-full">
					<Sidebar/>
					{/*<Inbox/>*/}
					</div>
					</div>
				</Fragment>
				}
				{matches.medium &&
				<Fragment>
				<Head>
				<title>Messages • Cosmeta NFT Marketplace</title>
				</Head>
					<div className="h-full py-20 pb-40">
					<div className="flex container mx-auto my-10 h-[calc(100vh-150px)] w-full">
					<Sidebar/>
					<Inbox/>
					</div>
					</div>
				</Fragment>
				}
				{matches.large &&
				<Fragment>
				<Head>
				<title>Messages • Cosmeta NFT Marketplace</title>
				</Head>
					<div className="h-full py-20 pb-40">
					<div className="flex container mx-auto my-10 h-[calc(100vh-150px)] w-full">
					<Sidebar/>
					<Inbox/>
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

export default InboxLayout;
