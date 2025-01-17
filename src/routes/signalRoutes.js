const express = require('express');
const router = express.Router();
const signalController = require('../controllers/signalController');


// Signal Routes
router.post('/create', signalController.createSignal);
router.get('/list', signalController.getAllSignals);
// router.get('/get/:signalId', signalController.getSignal);
// router.put('/update/:signalId', signalController.updateSignal);
// router.delete('/delete/:signalId', signalController.deleteSignal);



module.exports = router;