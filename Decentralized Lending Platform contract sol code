/ SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedLending {

    // Struct to represent a loan request
    struct LoanRequest {
        uint256 amount;
        uint256 interestRate;
        uint256 duration;
        address borrower;
        bool isApproved;
        bool isRepaid;
    }

    // Mapping to track all loan requests by their ID
    mapping(uint256 => LoanRequest) public loanRequests;

    uint256 public loanRequestCount;

    // Event to log loan approval
    event LoanApproved(uint256 loanId, address borrower, uint256 amount, uint256 interestRate, uint256 duration);

    // Event to log loan repayment
    event LoanRepaid(uint256 loanId, address borrower);

    // Function to create a new loan request
    function createLoanRequest(uint256 _amount, uint256 _interestRate, uint256 _duration) public {
        loanRequestCount++;
        loanRequests[loanRequestCount] = LoanRequest({
            amount: _amount,
            interestRate: _interestRate,
            duration: _duration,
            borrower: msg.sender,
            isApproved: false,
            isRepaid: false
        });
    }

    // Function to approve a loan request (only accessible by the contract owner)
    function approveLoan(uint256 loanId) public {
        LoanRequest storage loan = loanRequests[loanId];
        require(!loan.isApproved, "Loan already approved.");
        loan.isApproved = true;

        // Emit event
        emit LoanApproved(loanId, loan.borrower, loan.amount, loan.interestRate, loan.duration);
    }

    // Function to repay the loan (borrower can repay)
    function repayLoan(uint256 loanId) public payable {
        LoanRequest storage loan = loanRequests[loanId];
        require(msg.sender == loan.borrower, "Only the borrower can repay.");
        require(loan.isApproved, "Loan not approved.");
        require(!loan.isRepaid, "Loan already repaid.");
        require(msg.value == loan.amount + (loan.amount * loan.interestRate / 100), "Incorrect repayment amount.");

        loan.isRepaid = true;

        // Emit event
        emit LoanRepaid(loanId, loan.borrower);
    }
}
