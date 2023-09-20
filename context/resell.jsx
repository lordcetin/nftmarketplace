{/*
<div className='flex justify-center items-center my-10'>
    <div className='flex-col'>
  
      <div className='flex py-3 px-10 bg-gradient-to-t to-slate-900 from-transparent rounded-xl justify-center items-center mt-7 mb-10 gap-x-1'>
        <h3 className='text-slate-400 text-xl'>Latest Relisted NFT's on Goerli</h3><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png' className='object-cover w-6'/><span className='text-slate-300 text-xl'>ETHEREUM</span>
      </div>
    <div className='grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4 ease-linear transition-all '>
    {
      goelist.slice(0, 9).map((nft) => {
        async function buylistNft() {
          const web3Modal = new Web3Modal()
          const connection = await web3Modal.connect()
          const provider = new ethers.providers.Web3Provider(connection)
          const signer = provider.getSigner()
          const contract = new ethers.Contract(goeresell, Resell, signer)
          const transaction = await contract.buyNft(nft.tokenId, { value: nft.cost })
          await transaction.wait()
          router.push('/profile')
        }
        return(
        <div key={uid} className="w-[300px] relative hover:bottom-2 overflow-hidden border-2 border-slate-800 border-r-slate-700 rounded-xl hover:shadow-2xl hover:shadow-blue-900">
          <div className='bg-gradient-to-tr to-slate-600 from-slate-900 text-slate-400 cursor-pointer'>
              <img className='rounded-t-xl object-cover' src={nft.images} />
            <div className='flex-col px-5'>
                  <div className='flex justify-between items-center w-full my-3'>
                          
                  <div className="justify-start items-center w-full">
                    <h3 className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">balzamico <MdVerified size={18}/></h3>
                  </div>
  
                  <div className='flex justify-end items-center w-full'>
                    <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {nft.tokenId}</h3>
                  </div>
  
                </div>
                <div>
                  <h1>{nft.name}</h1>
                </div>
                <div className='flex justify-center items-center gap-x-2 py-4'>
                  <h1 className='font-bold text-lg flex items-center gap-x-2 my-3 text-slate-500'>{nft.val}<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png' className='object-cover w-6' /></h1>
                  <Button className='bg-gradient-to-tl to-purple-400 from-blue-500 hover:to-purple-600 hover:from-blue-700' onClick={() => buylistNft(nft)}>Buy</Button>
                </div>
            </div>
          </div>
        </div>
        )
      })
    }
  </div>
  </div>
  </div>{// LATEST RELISTED NFT's on GOERLI END}

  <div className='flex justify-center items-center my-10'>
    <div className='flex-col'>
  
      <div className='flex py-3 px-10 bg-gradient-to-t to-slate-900 from-transparent rounded-xl justify-center items-center mt-7 mb-10 gap-x-1'>
        <h3 className='text-slate-400 text-xl'>Latest NFT's on</h3><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png' className='object-cover w-6'/><span className='text-slate-300 text-xl'>ETHEREUM</span>
      </div>
    <div className='grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4 ease-linear transition-all '>
    {
      goenfts.slice(0, 4).map((nft) => (
        <div key={uid} className="w-[300px] relative hover:bottom-2 overflow-hidden border-2 border-slate-800 border-r-slate-700 rounded-xl hover:shadow-2xl hover:shadow-blue-900">
          <div className='bg-gradient-to-tr to-slate-600 from-slate-900 text-slate-400 cursor-pointer'>
              <img className='rounded-t-xl object-cover' src={nft.images} />
            <div className='flex-col px-5'>
                  <div className='flex justify-between items-center w-full my-3'>
                          
                  <div className="justify-start items-center w-full">
                    <h3 className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">balzamico <MdVerified size={18}/></h3>
                  </div>
  
                  <div className='flex justify-end items-center w-full'>
                    <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {nft.tokenId}</h3>
                  </div>
  
                </div>
                <div>
                  <h1>{nft.name}</h1>
                </div>
                <div className='flex justify-center items-center gap-x-2 py-4'>
                  <h1 className='font-bold text-lg flex items-center gap-x-2 my-3 text-slate-500'>{nft.price}<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png' className='object-cover w-6' /></h1>
                  <Button className='bg-gradient-to-tl to-purple-400 from-blue-500 hover:to-purple-600 hover:from-blue-700' onClick={() => buyNewGoe(nft)}>Buy</Button>
                </div>
            </div>
          </div>
        </div>
      ))
    }
  </div>
  </div>
</div>{// LATEST NFT's on GOERLI END }

<div className='flex justify-center items-center my-10'>
    <div className='flex-col'>
  
      <div className='flex py-3 px-10 bg-gradient-to-t to-slate-900 from-transparent rounded-xl justify-center items-center mt-7 mb-10 gap-x-1'>
        <h3 className='text-slate-400 text-xl'>Latest Relisted NFT's on </h3><img src='https://cdn0.iconfinder.com/data/icons/blockchain-classic/256/Binance_Coin-64.png' className='object-cover w-6'/><span className='text-slate-300 text-xl'>BINANCE</span>
      </div>
    <div className='grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4 ease-linear transition-all '>
    {
      bsctlist.slice(0, 9).map((nft) => {
        async function buylistNft() {
          const web3Modal = new Web3Modal()
          const connection = await web3Modal.connect()
          const provider = new ethers.providers.Web3Provider(connection)
          const signer = provider.getSigner()
          const contract = new ethers.Contract(bsctresell, Resell, signer)
          const transaction = await contract.buyNft(nft.tokenId, { value: nft.cost })
          await transaction.wait()
          router.push('/profile')
        }
        return(
        <div key={uid} className="w-[300px] relative hover:bottom-2 overflow-hidden border-2 border-slate-800 border-r-slate-700 rounded-xl hover:shadow-2xl hover:shadow-blue-900">
          <div className='bg-gradient-to-tr to-slate-600 from-slate-900 text-slate-400 cursor-pointer'>
              <img className='rounded-t-xl object-cover' src={nft.images} key={uid} />
            <div className='flex-col px-5'>
                  <div className='flex justify-between items-center w-full my-3'>
                          
                  <div className="justify-start items-center w-full">
                    <h3 className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">balzamico <MdVerified size={18}/></h3>
                  </div>
  
                  <div className='flex justify-end items-center w-full'>
                    <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {nft.tokenId}</h3>
                  </div>
  
                </div>
                <div>
                  <h1>{nft.name}</h1>
                </div>
                <div className='flex justify-center items-center gap-x-2 py-4'>
                  <h1 className='font-bold text-lg flex items-center gap-x-2 my-3 text-slate-500'>{nft.val}<img src='https://cdn0.iconfinder.com/data/icons/blockchain-classic/256/Binance_Coin-64.png' className='object-cover w-6' /></h1>
                  <Button className='bg-gradient-to-tl to-purple-400 from-blue-500 hover:to-purple-600 hover:from-blue-700' onClick={() => buylistNft(nft)}>Buy</Button>
                </div>
            </div>
          </div>
        </div>
        )
      })
    }
  </div>
  </div>
</div>{// LATEST RELISTED NFT's on BSC END }

<div className='flex justify-center items-center my-10'>
    <div className='flex-col'>
  
      <div className='flex py-3 px-10 bg-gradient-to-t to-slate-900 from-transparent rounded-xl justify-center items-center mt-7 mb-10 gap-x-1'>
        <h3 className='text-slate-400 text-xl'>Latest NFT's on </h3><img src='https://cdn0.iconfinder.com/data/icons/blockchain-classic/256/Binance_Coin-64.png' className='object-cover w-6'/><span className='text-slate-300 text-xl'>BINANCE</span>
      </div>
    <div className='grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4 ease-linear transition-all '>
    {
      bsctnfts.slice(0, 4).map((nft) => (
        <div key={uid} className="w-[300px] relative hover:bottom-2 overflow-hidden border-2 border-slate-800 border-r-slate-700 rounded-xl hover:shadow-2xl hover:shadow-blue-900">
          <div className='bg-gradient-to-tr to-slate-600 from-slate-900 text-slate-400 cursor-pointer'>
              <img className='rounded-t-xl object-cover' src={nft.images} key={uid} />
            <div className='flex-col px-5'>
                  <div className='flex justify-between items-center w-full my-3'>
                          
                  <div className="justify-start items-center w-full">
                    <h3 className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">balzamico <MdVerified size={18}/></h3>
                  </div>
  
                  <div className='flex justify-end items-center w-full'>
                    <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {nft.tokenId}</h3>
                  </div>
  
                </div>
                <div>
                  <h1>{nft.name}</h1>
                </div>
                <div className='flex justify-center items-center gap-x-2 py-4'>
                  <h1 className='font-bold text-lg flex items-center gap-x-2 my-3 text-slate-500'>{nft.price}<img src='https://cdn0.iconfinder.com/data/icons/blockchain-classic/256/Binance_Coin-64.png' className='object-cover w-6' /></h1>
                  <Button className='bg-gradient-to-tl to-purple-400 from-blue-500 hover:to-purple-600 hover:from-blue-700' onClick={() => buyNewBsct(nft)}>Buy</Button>
                </div>
            </div>
          </div>
        </div>
      ))
    }
  </div>
  </div>
</div>{// LATEST NFT's on BSC END }

<div className='flex justify-center items-center my-10'>
    <div className='flex-col'>
  
      <div className='flex py-3 px-10 bg-gradient-to-t to-slate-900 from-transparent rounded-xl justify-center items-center mt-7 mb-10 gap-x-1'>
        <h3 className='text-slate-400 text-xl'>Latest Relisted NFT's on </h3><img src='https://cryptologos.cc/logos/polygon-matic-logo.png' className='object-cover w-6'/><span className='text-slate-300 text-xl'>POLYGON</span>
      </div>
    <div className='grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4 ease-linear transition-all '>
    {
      mmlist.slice(0, 9).map((nft) => {
        async function buylistNft() {
          const web3Modal = new Web3Modal()
          const connection = await web3Modal.connect()
          const provider = new ethers.providers.Web3Provider(connection)
          const signer = provider.getSigner()
          const contract = new ethers.Contract(sepresell, Resell, signer)
          const transaction = await contract.buyNft(nft.tokenId, { value: nft.cost })
          await transaction.wait()
          router.push('/profile')
        }
        return(
        <div key={uid} className="w-[300px] relative hover:bottom-2 overflow-hidden border-2 border-slate-800 border-r-slate-700 rounded-xl hover:shadow-2xl hover:shadow-blue-900">
          <div className='bg-gradient-to-tr to-slate-600 from-slate-900 text-slate-400 cursor-pointer'>
              <img className='rounded-t-xl object-cover' src={nft.images} key={uid} />
            <div className='flex-col px-5'>
                  <div className='flex justify-between items-center w-full my-3'>
                          
                  <div className="justify-start items-center w-full">
                    <h3 className="text-md font-medium cursor-pointer text-purple-500 flex items-center gap-x-1">balzamico <MdVerified size={18}/></h3>
                  </div>
  
                  <div className='flex justify-end items-center w-full'>
                    <h3 className='font-medium text-sm text-center bg-slate-800 text-slate-500 py-1 px-3 rounded-md'>Token ID : {nft.tokenId}</h3>
                  </div>
  
                </div>
                <div>
                  <h1>{nft.name}</h1>
                </div>
                <div className='flex justify-center items-center gap-x-2 py-4'>
                  <h1 className='font-bold text-lg flex items-center gap-x-2 my-3 text-slate-500'>{nft.val}<img src='https://cryptologos.cc/logos/polygon-matic-logo.png' className='object-cover w-6' /></h1>
                  <Button className='bg-gradient-to-tl to-purple-400 from-blue-500 hover:to-purple-600 hover:from-blue-700' onClick={() => buylistNft(nft)}>Buy</Button>
                </div>
            </div>
          </div>
        </div>
        )
      })
    }
  </div>
  </div>
</div>{// LATEST RELISTED NFT's on POLYGON END }
*/}