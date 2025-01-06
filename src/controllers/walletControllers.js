const axios = require("axios");
const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.INFURA_API_URL)
);
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const depositHandler = async (req, res) => {
  const { fromAddress, amount, email } = req.body; // Amount in Ether

  try {
    //find user by email
    const foundUser = await User.find({ email: email });
    const userId = foundUser._id;
    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, messaage: "User with email does not exists." });
    }

    const transactionOpt = {
      from: fromAddress,
      to: account.address,
      value: web3.utils.toWei(amount, "ether"),
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(
      transactionOpt,
      process.env.PRIVATE_KEY
    );

    const receipt = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );
    const { transactionHash, blockNumber, gasUsed, status } = receipt;

    //Create new transaction data
    const transaction = await Transaction.create({
      userId,
      transactionHash,
      blockNumber,
      gasUsed,
      status: status === true,
      type: "deposit",
    });

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const withdrawHandler = async (req, res) => {
  const { toAddress, amount } = req.body; // Amount in Ether

  try {
    const foundUser = await User.find({ email: email });
    const userId = foundUser._id;
    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, messaage: "User with email does not exists." });
    }

    const transactionOpt = {
      from: account.address,
      to: toAddress,
      value: web3.utils.toWei(amount, "ether"),
      gas: 21000, // Standard gas limit for ETH transfers
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(
      transactionOpt,
      process.env.PRIVATE_KEY
    );

    const receipt = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );
    const { transactionHash, blockNumber, gasUsed, status } = receipt;

    //create transaction object for DB
    const transaction = await Transaction.create({
      transactionHash,
      blockNumber,
      gasUsed,
      status,
      type: "withdraw",
    });

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const transactionHandler = async (req, res) => {
  const { walletAddress } = req.params;

  try {
    // Fetch all transactions involving the user's address
    const transactions = await getTransactionsForUser(walletAddress);
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

async function getTransactionsForUser(address) {
  const etherscanApiKey = process.env.ETHERSCAN_API_KEY; // Add your Etherscan API key to .env
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${etherscanApiKey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status === "1") {
      return response.data.result.map((tx) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: web3.utils.fromWei(tx.value, "ether"),
        gasUsed: tx.gasUsed,
        blockNumber: tx.blockNumber,
        timestamp: new Date(tx.timeStamp * 1000),
        status: tx.txreceipt_status === "1" ? "Success" : "Failed",
      }));
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    throw new Error("Unable to fetch transactions");
  }
}

module.exports = { depositHandler, withdrawHandler, transactionHandler };
