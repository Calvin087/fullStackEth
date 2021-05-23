import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";
import "./App.css";

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const tokenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function App() {
  const [greeting, setGreetingValue] = useState("");
  const [displayGreeting, setDisplayGreetingValue] = useState("");
  const [userAccount, setUserAccount] = useState("");
  const [amount, setAmount] = useState(0);
  const [transactionConfirm, setTransactionConfirm] = useState("");
  const [userBalance, setUserBalance] = useState("");

  const requestAccount = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      setUserBalance(balance.toString());
      console.log("balance: ", balance.toString());
    }
  };

  const sendCoins = async () => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins sent to ${userAccount}`);
    }
  };

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );

      try {
        const data = await contract.greet();
        console.log("data:", data);
        setDisplayGreetingValue(data);
      } catch (err) {
        console.log("Error:", err);
      }
    }
  };

  const setGreeting = async () => {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue("");
      await transaction.wait();
      fetchGreeting();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="box is-flex-wrap-wrap">
          <div>
            <button className="button is-primary mb-2" onClick={fetchGreeting}>
              Fetch Greeting
            </button>
            <br />
            <button className="button is-primary mb-4" onClick={setGreeting}>
              Set Greeting
            </button>
            <input
              class="input is-info"
              onChange={(e) => setGreetingValue(e.target.value)}
              placeholder="Set Greeting"
              value={greeting}
            />
            {displayGreeting && <p>{displayGreeting}</p>}
          </div>

          <br />

          <div>
            <button className="button is-primary mb-2" onClick={getBalance}>
              Get Balance
            </button>
            <br />
            <button className="button is-primary mb-4" onClick={sendCoins}>
              Send Coins
            </button>
            <input
              class="input is-info mb-4"
              type="text"
              onChange={(e) => setUserAccount(e.target.value)}
              placeholder="Account ID"
            />
            <input
              class="input is-info"
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            {userBalance && <p>{`Current user balance is ${userBalance}`}</p>}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
