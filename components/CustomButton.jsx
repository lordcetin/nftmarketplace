import { useWeb3Modal,useWeb3ModalTheme } from "@web3modal/react";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import Image from "next/image";

export default function CustomButton() {
  const [loading, setLoading] = useState(false);
  const { open } = useWeb3Modal();
  const { isConnected , onConnect } = useAccount();
  const { disconnect } = useDisconnect();
  const { theme, setTheme } = useWeb3ModalTheme()
  const label = isConnected ? "Disconnect" : 'Connect';

  const router = useRouter()

  async function onOpen() {
    setLoading(true);
    await open();
    setLoading(false);
  }


  async function onClick() {
    if (isConnected) {
      disconnect();
    } else {
      onOpen();
    }
  }
// useEffect(() => {
  
//   // Modal's theme object
// theme

// // Set modal theme
// setTheme({
//   themeMode: 'dark',
//   themeVariables: {
//     '--w3m-font-family': 'Opensans, sans-serif',
//     '--w3m-accent-color': '#F5841F',
//     '--w3m-background-color':'#ffffff0d',
//     '--w3m-logo-image-url':'https://bafkreifqhadlplgpyhqlmx3xkogtu5vs3fkiyxqkjfx3siacivkjmpjq64.ipfs.nftstorage.link/',
//     '--w3m-z-index':9999
//     // ...
//   }
// })
// },[])

  return (
    <button onClick={onClick} disabled={loading} className="transition-all ease-in-out duration-700 bg-gradient-to-l to-purple-500 from-orange-400 hover:to-purple-600 hover:from-orange-500 px-5 py-1 rounded-md border-t-[1px] border-r-[1px] border-l-[1px] border-l-pink-500 border-t-slate-300 border-r-orange-600 text-white">
      {loading ? "Loading..." : label}
    </button>
  );
}