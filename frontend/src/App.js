import React, { useState } from "react";
import { BrowserProvider } from "ethers";
import "./styles.css"; // Import the CSS file

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");

  async function connectWallet() {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
    } else {
      alert("MetaMask not found. Please install it to use the platform.");
    }
  }
  

  return (
    <div className="container">
      <header className="header">
        <h1>Carbon Credit Marketplace</h1>
      </header>
      <main className="main">
        <section className="section">
          <h2>Welcome to the Carbon Credit Marketplace</h2>
          <p>
            Buy, sell, and track carbon credits in a transparent and verifiable way.
          </p>
        </section>

        <section className="section">
          <h3>Connect Your Wallet</h3>
          <button onClick={connectWallet} className="button">
            {walletAddress ? `Connected: ${walletAddress}` : "Connect Wallet"}
          </button>
        </section>

        <section className="section">
          <h3>Marketplace</h3>
          <div className="grid">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="card">
                <h4>Carbon Credit #{idx + 1}</h4>
                <p>Value: {(Math.random() * 10).toFixed(2)} ETH</p>
                <p>Owner: 0x{Math.random().toString(16).slice(2, 8)}</p>
                <button className="button">Buy</button>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h3>Crypto Gifting</h3>
          <p>
            Gift crypto securely to your loved ones, and 50% of proceeds go to
            charity.
          </p>
          <button className="button">Gift Crypto</button>
        </section>
      </main>

      <footer className="footer">
        &copy; 2025 Carbon Credit Marketplace. All rights reserved.
      </footer>
    </div>
  );
}