import React, { useEffect, useState } from "react";
import Web3 from "web3";
import ContractABI from "./DecentralizedLendingABI.json"; // Import ABI JSON file

const CONTRACT_ADDRESS = "0xYourContractAddressHere";

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [loanRequests, setLoanRequests] = useState([]);
  const [form, setForm] = useState({ amount: "", interestRate: "", duration: "" });

  // Initialize web3 and contract
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(ContractABI, CONTRACT_ADDRESS);
        setWeb3(web3);
        setContract(contract);
        setAccount(accounts[0]);
        fetchLoanRequests(contract);
      }
    };
    init();
  }, []);

  const fetchLoanRequests = async (contractInstance) => {
    const count = await contractInstance.methods.loanRequestCount().call();
    const loans = [];
    for (let i = 1; i <= count; i++) {
      const loan = await contractInstance.methods.loanRequests(i).call();
      loans.push({ id: i, ...loan });
    }
    setLoanRequests(loans);
  };

  const handleCreateLoan = async () => {
    const { amount, interestRate, duration } = form;
    await contract.methods
      .createLoanRequest(amount, interestRate, duration)
      .send({ from: account });
    fetchLoanRequests(contract);
  };

  const handleApprove = async (loanId) => {
    await contract.methods.approveLoan(loanId).send({ from: account });
    fetchLoanRequests(contract);
  };

  const handleRepay = async (loan) => {
    const repayAmount = Number(loan.amount) + (Number(loan.amount) * Number(loan.interestRate)) / 100;
    await contract.methods.repayLoan(loan.id).send({ from: account, value: web3.utils.toWei(repayAmount.toString(), 'wei') });
    fetchLoanRequests(contract);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Decentralized Lending DApp</h2>
      <div>
        <h3>Create Loan Request</h3>
        <input
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          placeholder="Interest Rate (%)"
          value={form.interestRate}
          onChange={(e) => setForm({ ...form, interestRate: e.target.value })}
        />
        <input
          placeholder="Duration"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />
        <button onClick={handleCreateLoan}>Create Loan</button>
      </div>

      <div>
        <h3>Loan Requests</h3>
        {loanRequests.map((loan) => (
          <div key={loan.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p><strong>ID:</strong> {loan.id}</p>
            <p><strong>Borrower:</strong> {loan.borrower}</p>
            <p><strong>Amount:</strong> {loan.amount}</p>
            <p><strong>Interest:</strong> {loan.interestRate}%</p>
            <p><strong>Duration:</strong> {loan.duration}</p>
            <p><strong>Approved:</strong> {loan.isApproved ? "Yes" : "No"}</p>
            <p><strong>Repaid:</strong> {loan.isRepaid ? "Yes" : "No"}</p>
            {!loan.isApproved && (
              <button onClick={() => handleApprove(loan.id)}>Approve Loan</button>
            )}
            {loan.isApproved && !loan.isRepaid && loan.borrower === account && (
              <button onClick={() => handleRepay(loan)}>Repay Loan</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


  
    
