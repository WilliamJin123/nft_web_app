import { useState } from 'react';
import { ethers } from 'ethers';

function WalletBalance() {

    const [balance, setBalance] = useState();
    
    const getBalance = async () => {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum); //interacting with the blockchain
        const balance = await provider.getBalance(account);
        setBalance(ethers.formatEther(balance)); //big number to number
    };
  
    return (
        <div className='card'>
      <div>
          <h5>Your Balance: {balance}</h5>
          <button onClick={() => getBalance()}>Show My Balance</button>
      </div>
      </div>
    );
  };
  
  export default WalletBalance;