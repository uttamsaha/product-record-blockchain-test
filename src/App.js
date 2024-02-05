//contract address: 0x311EAc20935625482fB4ECF406C0046b65Aa9584 0x364273743a19eb68EBB9d901c0707994b50E5b96
import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import abi from "./abi.json";
import './App.css';
import swal from 'sweetalert';
const { ethereum } = window;


function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");


  const checkIfWalletIsConnected = async() => {
        try {
            if(!ethereum)  return alert("Please install MetaMak.");
            const accounts = await ethereum.request({method: 'eth_accounts'});

            if(accounts.length){ //if accounted connected
            setCurrentAccount(accounts[0]);
        } else {
            console.log("No account found");
        }
        console.log(accounts);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask!!!");
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (err) {
      throw new Error("No ethereum object found");
    }
  }

    const newItem = async (event) => {
      event.preventDefault();
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        let _text = event.target._text.value;
        let _date = event.target._date.value;
    
        const supplyContract = new ethers.Contract("0x80e4f020Fbc6705FE5cF04CB707AB6984dFA150a", abi, signer);
        const supplyChainHash = await supplyContract.newItem(_text, _date);
        setIsLoading(true)
        console.log(`Loading - ${supplyChainHash.hash}`);
        await supplyChainHash.wait();
        setIsLoading(false)
        console.log(`Success - ${supplyChainHash.hash}`);
        swal("Item  Added", "Item Successfully Added."+supplyChainHash.hash, "success");
      
    }

  
  useEffect(()=>{
    checkIfWalletIsConnected();
  },[])
  return (
    <div className="mh-100 m-auto">
     

      <h1 className='text-primary text-center mb-4  fw-bold  bg-body-secondary p-2 shadow-sm rounded-bottom-pill'>Product Record Management System</h1>
      <form onSubmit={newItem} className="w-25 mx-auto">
        <input className='form-control' type="text" name='_text' placeholder="Enter Text"/> <br/>
        <input className='form-control' type="text" name='_date' placeholder="Enter Date"/> <br/>
        <button type='submit' className='btn btn-primary w-100'>Add Item</button>
      </form>

      {
        isLoading ? <div className=' d-flex justify-content-center m-3'>
        <div className="spinner-border" role="status" >
          <span className="visually-hidden me-5">Loading...</span>
        </div>
        </div> : null
      }

<br/>
      <div className='d-flex justify-content-center'>
      
      {
        !currentAccount ? <button className='btn btn-warning ' onClick={connectWallet}>Connect Wallet</button> : null
      }
      </div>
    </div>
  );
}

export default App;
