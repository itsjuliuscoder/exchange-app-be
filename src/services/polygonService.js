const polygonClient = require("../config/polygon");

const getMarketData = async () => {
    const response = await polygonClient.get("/v2/aggs/tickers");
    console.log("this is market data -->", response);
    return response.data;
};

const getTickerInfo = async (ticker) => {
    const response = await polygonClient.get(`/v1/last/stocks/${ticker}`);
    return response.data;
};

const placeOrder = async (orderData) => {
    // Example: Handle order placement logic here
    // Polygon API doesn't directly support order placement.
    return { message: "Order placed", orderData };
};

const cancelOrder = async (orderId) => {
    // Handle order cancellation logic
    return { message: `Order ${orderId} cancelled` };
};

const getOrderHistory = async (userId) => {
    // Retrieve and return user-specific trade history
    return { userId, history: [] };
};

module.exports = {
    getMarketData,
    getTickerInfo,
    placeOrder,
    cancelOrder,
    getOrderHistory,
};
