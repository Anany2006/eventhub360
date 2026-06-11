const assetRepository = require('../repositories/assetRepository');

class AssetService {
  async addAsset(assetData) {
    if (assetData.asset_code) {
      assetData.asset_code = assetData.asset_code.toUpperCase();
    }
    return await assetRepository.createAsset(assetData);
  }

  async listAssets(filters) {
    const limit = parseInt(filters.limit) || 10;
    const offset = parseInt(filters.offset) || 0;
    const sortBy = ['id', 'purchase_cost', 'purchase_date'].includes(filters.sortBy) ? filters.sortBy : 'id';
    const order = filters.order === 'DESC' ? 'DESC' : 'ASC';
    
    return await assetRepository.getPaginatedAssets({ limit, offset, sortBy, order, status: filters.status });
  }

  async changeAssetStatus(id, newStatus, userId) {
    if (!newStatus || !userId) {
      throw new Error('Status modification requests require validation parameters.');
    }
    return await assetRepository.updateAssetStatus(id, newStatus, userId);
  }
}

module.exports = new AssetService();