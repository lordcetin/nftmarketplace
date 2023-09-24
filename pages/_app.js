import React, { Fragment } from 'react';
import {createTheme,NextUIProvider} from '@nextui-org/react';
import '../styles/globals.css';
import {Layout} from '../components';
import {StateContext} from '../context/StateContext';
import { DataProvider } from '../store/GlobalState'
import Router from 'next/router';
import PreLoader from '@/components/PreLoader';
import { Provider } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from '@/store/store';
import { useEffect, useState } from "react";
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygon } from 'wagmi/chains'

// 1. Get projectId
const projectId = 'd12fbd56d55bd60ff533497349a66eeb'

// 2. Create wagmiConfig
const chains = [arbitrum, mainnet, polygon]
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)


function MyApp({ Component, pageProps}) {
  const [loading,setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);


Router.events.on('routeChangeStart',(url) => {
  setLoading(true)
})
Router.events.on('routeChangeComplete',() => {
  setLoading(false)
})
Router.events.on('routeChangeError',() => {
  setLoading(false)
  console.log("Router error")
})


  const theme = createTheme({
    type: "dark", // it could be "light" or "dark"
    theme: {
      colors: {
        // brand colors
        primaryLight: '$green200',
        primaryLightHover: '$green300',
        primaryLightActive: '$green400',
        primaryLightContrast: '$green600',
        primary: '#4ADE7B',
        primaryBorder: '$green500',
        primaryBorderHover: '$green600',
        primarySolidHover: '$green700',
        primarySolidContrast: '$white',
        primaryShadow: '$green500',
  
        gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
        link: '#5E1DAD',
  
        // you can also create your own color
        myColor: '#ff4ecd'
  
        // ...  more colors
      },
      space: {},
      fonts: {}
    }
  })
  return (
    <>
    {ready ? (

      <Provider store={store}>
        <WagmiConfig config={wagmiConfig}>
          <DataProvider>
            <StateContext>
              <NextUIProvider theme={theme}>
                  {loading && <PreLoader/>}
                    <Layout>
                      <Component {...pageProps} />
                      <ToastContainer
                      position="top-center"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="dark"
                      />
                    </Layout>
              </NextUIProvider>
            </StateContext>
          </DataProvider>
          </WagmiConfig> 
        </Provider>

       ) : null}   
       <Web3Modal projectId={projectId} ethereumClient={ethereumClient} themeMode='dark' themeVariables={{
        '--w3m-font-family': 'Opensans, sans-serif',
        '--w3m-accent-color': '#F5841F',
        '--w3m-background-color':'#ffffff0d',
        '--w3m-logo-image-url':'https://bafkreifqhadlplgpyhqlmx3xkogtu5vs3fkiyxqkjfx3siacivkjmpjq64.ipfs.nftstorage.link/',
        '--w3m-z-index':9999
      }}/>
    </>
    );
}

export default MyApp