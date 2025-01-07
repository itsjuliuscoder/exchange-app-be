const app = require("./app");
const { PORT, INFURA_API_URL, PRIVATE_KEY } = require("./config/env");
const Web3 = require("web3");

require("dotenv").config();

//Import and use routed
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");

app.use(authRoutes);
app.use("/wallet", walletRoutes);

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.INFURA_API_URL)
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
