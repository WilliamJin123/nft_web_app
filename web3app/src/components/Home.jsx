import WalletBalance from "./WalletBalance";
import { ethers } from "ethers";
import Pokemans from "../artifacts/contracts/pokemonNft.sol/Pokemans.json"
import { useEffect, useState } from "react";


const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const provider = new ethers.BrowserProvider(window.ethereum)
const signer = await provider.getSigner()
const contract = new ethers.Contract(contractAddress, Pokemans.abi, signer)

function Home() {

    const [mintedNum, setMintedNum] = useState(0)
    useEffect(() => {
        getCount();
    }, []);


    const getCount = async () => {
        const count = await contract.count();
        setMintedNum(parseInt(count))
        console.log(count, parseInt(count))
    }

    return (
        <div>
            <WalletBalance />

            <h1>Pokemans NFT Collection</h1>
                {Array(mintedNum+1).fill(0).map((_, i) => (
                    <div key={i}>
                        <NFTImage tokenId={i} />
                    </div>
                ))}
        </div>
    )
}

export default Home;


function NFTImage({ tokenId }) {
    const contentId = 'QmPZf7sLQphRH9eG8jxw2cgxjR9CHGyw7i9qVDhie5dJva'
    const ipfs = 'https://ipfs.filebase.io/ipfs'

    const link = `${ipfs}/${contentId}/${tokenId}`

   
    const metaDataURI = `${link}.json` //to setup
    const imageURI = `${link}.png` //tosetup
    console.log(imageURI)
    const [minted, setMinted] = useState(false)

    useEffect(() => {
        getMintedStatus();
        console.log(minted)
    }, [minted])

    const getMintedStatus = async () => {
        const result = await contract.isContentOwned(metaDataURI)
        console.log(result)
        setMinted(result)
    }

    const mintToken = async () => {
        const connection = contract.connect(signer)
        const addr = await connection.getAddress()


        const result = await contract.payToMint(addr, metaDataURI, {
            value: ethers.parseEther("0.01")
        })
        await result.wait()
        getMintedStatus()
        
    }

    async function getURI() {
        const uri = await contract.tokenURI(tokenId)
    }

    return(
        <div>
            {/* <img src={minted? imageURI : img/placeholder.png} */}
            <div>
                <h5>ID #{tokenId}</h5>
                {!minted ? (<button onClick={mintToken}>Mint</button>) : (<button onClick={getURI}>Taken! Show URI</button>)}
            </div>
        </div>
    )
}