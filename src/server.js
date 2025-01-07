const app = require("./app");
const { PORT } = require("./config/env");
const Web3 = require("web3");

//Import and use routed
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");

app.use(authRoutes);
app.use(walletRoutes);

//Initializing web3
const web3 = new Web3(process.env.INFURA_API_URL);
const account = web3.eth.account.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
