const Web3 = require('web3');
require('dotenv').config();

// Create a Web3 instance using the provider URL from Infura
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_API_URL));

const getWalletBalance = async (req, res) => {
  const { address } = req.params;

  try {
    const balance = await web3.eth.getBalance(address);
    res.status(200).json({ balance: web3.utils.fromWei(balance, 'ether') });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wallet balance', error: error.message });
  }
};

const sendTransaction = async (req, res) => {
  const { to, value, privateKey } = req.body;

  try {
    const signedTransaction = await web3.eth.accounts.signTransaction({
      to,
      value: web3.utils.toWei(value, 'ether'),
      gas: 2000000,
    }, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    res.status(200).json({ receipt });
  } catch (error) {
    res.status(500).json({ message: 'Error sending transaction', error: error.message });
  }
};

module.exports = {
  getWalletBalance,
  sendTransaction,
};