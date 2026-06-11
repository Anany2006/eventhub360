const assetService = require('../services/assetService');

class AssetController {
  async createAsset(req, res, next) {
    try {
      const newAsset = await assetService.addAsset(req.body);
      return res.status(201).json({ success: true, data: newAsset });
    } catch (error) {
      next(error);
    }
  }

  async getAllAssets(req, res, next) {
    try {
      const assets = await assetService.listAssets(req.query);
      return res.status(200).json({ success: true, count: assets.length, data: assets });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, userId } = req.body;
      const updated = await assetService.changeAssetStatus(id, status, userId);
      return res.status(200).json({
        success: true,
        message: 'Status processed, history tracked, audit snapshot preserved, and notification queued.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssetController();