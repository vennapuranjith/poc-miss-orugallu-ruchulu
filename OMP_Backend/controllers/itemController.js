const { sql } = require('../models/db');

const { poolPromise } = require('../models/db');

const getAllItems = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        ItemID AS id, 
        Name AS name, 
        Description AS description, 
        Price AS price, 
        Stock AS stock, 
        Category AS category,
        CONCAT('http://localhost:5000/uploads/', ImageUrl) AS imageUrl
      FROM Items
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error fetching items:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const getItemById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid item ID' });
  }
  try {
    const result = await sql.query`SELECT ItemID, Name, Description, Price, Stock FROM Items WHERE ItemID = ${id}`;
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllItems, getItemById };