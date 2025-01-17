const express = require('express');
const router = express.Router();

const assetController = require('../controllers/tradeController');


router.put('/:symbol', assetController.updateAssetValue);