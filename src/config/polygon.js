const axios = require("axios");

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

const polygonClient = axios.create({
    baseURL: "https://api.polygon.io",
    headers: {
        "Authorization": `Bearer ${POLYGON_API_KEY}`,
    },
});

module.exports = polygonClient;