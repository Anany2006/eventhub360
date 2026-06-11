const pool = require('../config/db');

class AssetRepository {
  async createAsset(assetData) {
    const { asset_code, asset_name, asset_type, purchase_date, purchase_cost, status } = assetData;
    const query = `
      INSERT INTO assets (asset_code, asset_name, asset_type, purchase_date, purchase_cost, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [asset_code, asset_name, asset_type, purchase_date, purchase_cost, status];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
  // METHOD 1 (Pagination Guardrails):
  async getPaginatedAssets({ limit = 10, offset = 0, sortBy = 'id', order = 'ASC', status }) {
    let query = `SELECT * FROM assets`;
    const values = [];
    if (status) {
      query += ` WHERE status = $1`;
      values.push(status);
    }
    const limitIdx = values.length + 1;
    const offsetIdx = values.length + 2;
    query += ` ORDER BY ${sortBy} ${order} LIMIT $${limitIdx} OFFSET $${offsetIdx};`;
    values.push(limit, offset);
    const { rows } = await pool.query(query, values);
    return rows;
  }
  // Phase 3, Task 1, 2 & 3: Optimized Transaction block
  async updateAssetStatus(assetId, newStatus, updatedByUserId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const currentAsset = await client.query('SELECT * FROM assets WHERE id = $1', [assetId]);
      if (currentAsset.rows.length === 0) throw new Error('Asset not found');
      const beforeState = currentAsset.rows[0];

      const updateQuery = `UPDATE assets SET status = $1 WHERE id = $2 RETURNING *;`;
      const updatedAsset = await client.query(updateQuery, [newStatus, assetId]);
      const afterState = updatedAsset.rows[0];

      const historyQuery = `
        INSERT INTO asset_history (asset_id, action)
        VALUES ($1, $2);
      `;
      await client.query(historyQuery, [assetId, `State changed to ${newStatus}`]);

      const auditQuery = `
        INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values)
        VALUES ($1, $2, $3, $4, $5);
      `;
      await client.query(auditQuery, [
        'assets', 
        assetId, 
        'UPDATE_STATUS', 
        JSON.stringify(beforeState), 
        JSON.stringify(afterState)
      ]);

      const notificationQuery = `
        INSERT INTO notifications (user_id, message, is_read)
        VALUES ($1, $2, false);
      `;
      await client.query(notificationQuery, [
        updatedByUserId, 
        `Asset ${beforeState.asset_code} successfully updated to ${newStatus}.`
      ]);

      await client.query('COMMIT');
      return afterState;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new AssetRepository();