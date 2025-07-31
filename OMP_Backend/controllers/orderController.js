const { sql, poolPromise } = require('../models/db');

const placeOrder = async (req, res) => {
  try {
    const { customer, items, total, userId } = req.body;

    // userId is optional for guest orders
    const pool = await poolPromise;

    // Insert into Orders (userId can be null)
    const orderResult = await pool.request()
      .input('UserID', userId ? sql.Int : sql.Int, userId || null)
      .input('TotalAmount', sql.Decimal(10, 2), total)
      .query(`INSERT INTO Orders (UserID, TotalAmount) OUTPUT INSERTED.OrderID VALUES (@UserID, @TotalAmount)`);
    const orderId = orderResult.recordset[0].OrderID;

    // Insert into OrderCustomerDetails
    await pool.request()
      .input('OrderID', sql.Int, orderId)
      .input('Name', sql.NVarChar(100), customer.name)
      .input('Phone', sql.NVarChar(15), customer.phone)
      .input('Address', sql.NVarChar(sql.MAX), customer.address)
      .query(`INSERT INTO OrderCustomerDetails (OrderID, Name, Phone, Address) VALUES (@OrderID, @Name, @Phone, @Address)`);

    // Insert into OrderItems
    for (const item of items) {
      await pool.request()
        .input('OrderID', sql.Int, orderId)
        .input('ItemID', sql.Int, item.id)
        .input('Quantity', sql.Int, item.quantity)
        .input('Price', sql.Decimal(10, 2), item.price)
        .query(`INSERT INTO OrderItems (OrderID, ItemID, Quantity, Price) VALUES (@OrderID, @ItemID, @Quantity, @Price)`);
    }

    res.json({ orderId });
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ message: "Order placement failed" });
  }
};

const getOrderDetails = async (req, res) => {
  const orderId = parseInt(req.params.orderId);

  if (isNaN(orderId)) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

  try {
    const pool = await poolPromise;

    const customerResult = await pool.request()
      .input('orderId', sql.Int, orderId)
      .query(`SELECT Name, Phone, Address FROM OrderCustomerDetails WHERE OrderID = @orderId`);

    if (customerResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const customer = customerResult.recordset[0];

    const orderResult = await pool.request()
      .input('orderId', sql.Int, orderId)
      .query(`
        SELECT o.TotalAmount, o.Status, o.OrderDate,
               i.Name AS ItemName, oi.Quantity, oi.Price
        FROM Orders o
        JOIN OrderItems oi ON o.OrderID = oi.OrderID
        JOIN Items i ON oi.ItemID = i.ItemID
        WHERE o.OrderID = @orderId
      `);

    const orderItems = orderResult.recordset.map(item => ({
      name: item.ItemName,
      quantity: item.Quantity,
      price: item.Price,
      total: item.Quantity * item.Price
    }));

    const { TotalAmount, Status, OrderDate } = orderResult.recordset[0];

    res.json({
      orderId,
      customer,
      items: orderItems,
      totalAmount: TotalAmount,
      status: Status,
      date: OrderDate
    });
  } catch (err) {
    console.error('❌ Error fetching order details:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT 
          o.OrderID,
          o.OrderDate,
          o.TotalAmount,
          oi.ItemID,
          i.Name AS ItemName,
          i.ImageURL,
          oi.Quantity,
          oi.Price
        FROM Orders o
        JOIN OrderItems oi ON o.OrderID = oi.OrderID
        JOIN Items i ON oi.ItemID = i.ItemID
        WHERE o.UserID = @userId
        ORDER BY o.OrderDate DESC
      `);

    // Group items by orderId
    const ordersMap = {};
    result.recordset.forEach(row => {
      if (!ordersMap[row.OrderID]) {
        ordersMap[row.OrderID] = {
          orderId: row.OrderID,
          orderDate: row.OrderDate,
          totalAmount: row.TotalAmount,
          items: [],
        };
      }
      ordersMap[row.OrderID].items.push({
        itemId: row.ItemID,
        name: row.ItemName,
        image: row.ImageURL,
        quantity: row.Quantity,
        price: row.Price,
      });
    });

    const orders = Object.values(ordersMap);
    res.json(orders);

  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
};

const getGuestOrders = async (req, res) => {
  const { phone } = req.query;
  if (!phone) return res.status(400).json({ message: "Phone number required" });
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('phone', sql.NVarChar(15), phone)
      .query(`
        SELECT 
          o.OrderID,
          o.OrderDate,
          o.TotalAmount,
          oi.ItemID,
          i.Name AS ItemName,
          i.ImageURL,
          oi.Quantity,
          oi.Price,
          c.Name AS Name,
          c.Phone AS phone
        FROM Orders o
        JOIN OrderCustomerDetails c ON o.OrderID = c.OrderID
        JOIN OrderItems oi ON o.OrderID = oi.OrderID
        JOIN Items i ON oi.ItemID = i.ItemID
        WHERE c.Phone = @phone
        ORDER BY o.OrderDate DESC
      `);

    // Group items by orderId
    const ordersMap = {};
    result.recordset.forEach(row => {
      if (!ordersMap[row.OrderID]) {
        ordersMap[row.OrderID] = {
          orderId: row.OrderID,
          orderDate: row.OrderDate,
          totalAmount: row.TotalAmount,
          customerName: row.Name, // <-- add this line
          phone: row.phone,
          items: [],
        };
      }
      ordersMap[row.OrderID].items.push({
        itemId: row.ItemID,
        name: row.ItemName,
        image: row.ImageURL,
        quantity: row.Quantity,
        price: row.Price,
      });
    });

    const orders = Object.values(ordersMap);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching guest orders:', err);
    res.status(500).json({ error: 'Server error fetching guest orders' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        o.OrderID,
        o.OrderDate,
        o.TotalAmount,
        o.Status,
        c.Name AS CustomerName,
        c.Phone AS CustomerPhone,
        o.UserID,
        oi.ItemID,
        i.Name AS Name,
        oi.Quantity,
        oi.Price
      FROM Orders o
      JOIN OrderCustomerDetails c ON o.OrderID = c.OrderID
      JOIN OrderItems oi ON o.OrderID = oi.OrderID
      JOIN Items i ON oi.ItemID = i.ItemID
      ORDER BY o.OrderDate DESC, o.OrderID, oi.ItemID
    `);

    // Group items by order
    const ordersMap = {};
    result.recordset.forEach(row => {
      if (!ordersMap[row.OrderID]) {
        ordersMap[row.OrderID] = {
          OrderID: row.OrderID,
          OrderDate: row.OrderDate,
          TotalAmount: row.TotalAmount,
          Status: row.Status,
          CustomerName: row.CustomerName,
          CustomerPhone: row.CustomerPhone,
          UserID: row.UserID,
          items: [],
        };
      }
      ordersMap[row.OrderID].items.push({
        ItemID: row.ItemID,
        Name: row.Name,
        Quantity: row.Quantity,
        Price: row.Price,
      });
    });

    const orders = Object.values(ordersMap);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ error: 'Server error fetching all orders' });
  }
};

module.exports = {
  placeOrder,
  getOrderDetails,
  getUserOrders,
  getGuestOrders,
  getAllOrders,
};