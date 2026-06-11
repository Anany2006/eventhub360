const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { validateAsset } = require('../validators/assetValidator');

router.post('/', validateAsset, assetController.createAsset);

router.get('/', assetController.getAllAssets);

router.patch('/:id/status', assetController.updateStatus);

module.exports = router;