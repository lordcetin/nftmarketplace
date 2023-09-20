import React, { useState,useEffect } from "react";
import Sidebar from "./components/sidebar";
import { TbMessageOff } from 'react-icons/tb'

const Inbox = () => {
	
  return (
	<div className="flex justify-center items-center text-center text-slate-400 w-full">

	<div className="flex-col justify-center items-center text-center">
		<TbMessageOff size={100} className="mb-4 ml-3"/>
		<p className="font-bold text-2xl">No Message</p>
	</div>

	</div>
    );
};

export default Inbox;
