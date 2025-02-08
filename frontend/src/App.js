import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther } from "ethers";
import "./styles.css";

// Replace with your actual contract ABI and address
const contractABI = [ /* Paste the ABI array here */ ];
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your actual contract address

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [credits, setCredits] = useState([]);

  async function connectWallet() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      alert("MetaMask not found. Please install it to use the platform.");
    }
  }

  async function fetchCredits() {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(contractAddress, contractABI, provider);
      const credits = await contract.getCredits();
      setCredits(credits);
    } catch (error) {
      console.error("Error fetching credits:", error);
      setCredits([
        { id: 1, name: "Solar Offset", value: "0.02", owner: "0x1234", forSale: true },
        { id: 2, name: "Reforestation Credit", value: "0.05", owner: "0x5678", forSale: true },
      ]);
    }
  }

  async function buyCredit(creditId) {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);

      const credit = credits[creditId];
      const transaction = await contract.buyCredit(creditId, {
        value: parseEther(credit.value.toString()),
      });
      await transaction.wait();
      alert("Purchase successful!");
      fetchCredits();
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
    }
  }

  async function giftCrypto() {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    const recipient = prompt("Enter recipient's wallet address:");
    if (!recipient) return;

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const transaction = await signer.sendTransaction({
        to: recipient,
        value: parseEther("0.05"),
      });

      await transaction.wait();
      alert("Gift sent successfully!");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
    }
  }

  async function listCreditForSale(creditId, price) {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);

      const transaction = await contract.listCreditForSale(creditId, parseEther(price.toString()));
      await transaction.wait();
      alert("Credit listed for sale successfully!");
      fetchCredits();
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
    }
  }

  useEffect(() => {
    fetchCredits();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <nav className="navbar">
          <h1>Carbon Credit Marketplace</h1>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#marketplace">Marketplace</a></li>
            <li><a href="#gift">Gift Crypto</a></li>
          </ul>
        </nav>
      </header>
      
      <main className="main">
        <section className="section">
          <h2>Welcome to the Carbon Credit Marketplace</h2>
          <p>Buy, sell, and track carbon credits in a transparent and verifiable way.</p>
        </section>

        <section className="section">
          <h3>Connect Your Wallet</h3>
          <button onClick={connectWallet} className="button">
            {walletAddress ? `Connected: ${walletAddress}` : "Connect Wallet"}
          </button>
        </section>

        <section id="marketplace" className="section">
          <h3>Marketplace</h3>
          <div className="grid">
            {credits.length > 0 ? (
              credits.map((credit, idx) => (
                <div key={idx} className="card">
                  <h4>{credit.name}</h4>
                  <p>Value: {credit.value} ETH</p>
                  <p>Owner: {credit.owner}</p>
                  {credit.forSale ? (
                    <button className="button" onClick={() => buyCredit(credit.id)}>Buy</button>
                  ) : (
                    <button className="button" onClick={() => listCreditForSale(credit.id, prompt("Enter price in ETH:"))}>List for Sale</button>
                  )}
                </div>
              ))
            ) : (
              <p>Loading carbon credits...</p>
            )}
          </div>
        </section>

        <section id="gift" className="section">
          <h3>Crypto Gifting</h3>
          <p>Gift crypto securely to your loved ones, and 50% of proceeds go to charity.</p>
          <button className="button" onClick={giftCrypto}>Gift Crypto</button>
        </section>
      </main>

      <footer className="footer">
        &copy; 2025 Carbon Credit Marketplace. All rights reserved.
      </footer>
    </div>
  );
}