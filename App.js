// app.js

// Connect to Web3.js and the smart contract
const Web3 = require('web3');
const web3 = new Web3(window.ethereum);  // Connects to MetaMask or any injected Ethereum provider

// Define the contract ABI and address (make sure to replace with your actual contract ABI and deployed address)
const contractABI = [
  // ABI content (should be copied from the contract ABI output)
];

const contractAddress = "0x0eB1DE1739d10CB50bAF10f279e09aAC2c1120aE";  // Replace with your contract address

// Initialize the contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

// DOM Elements
const loanForm = document.getElementById("loan-form");
const borrowerInput = document.getElementById("borrower-address");
const amountInput = document.getElementById("loan-amount");
const durationInput = document.getElementById("loan-duration");
const requestLoanButton = document.getElementById("request-loan-btn");
const loanList = document.getElementById("loan-list");

// Request a loan
async function requestLoan() {
  const borrowerAddress = borrowerInput.value;
  const amount = web3.utils.toWei(amountInput.value, 'ether'); // Converting the amount to wei
  const duration = parseInt(durationInput.value);

  const accounts = await web3.eth.getAccounts();
  const borrower = accounts[0];

  if (!borrower) {
    alert("Please connect your wallet first.");
    return;
  }

  try {
    // Send transaction to the smart contract to request a loan
    await contract.methods
      .requestLoan(amount, duration)
      .send({ from: borrower });

    alert("Loan request submitted!");
    loadLoanRequests();  // Refresh the list of loan requests after submission
  } catch (err) {
    console.error(err);
    alert("There was an error submitting the loan request.");
  }
}

// Load all loan requests
async function loadLoanRequests() {
  const loanCount = await contract.methods.nextLoanId().call();  // Get the total number of loan requests
  loanList.innerHTML = '';  // Clear the existing list

  for (let i = 0; i < loanCount; i
