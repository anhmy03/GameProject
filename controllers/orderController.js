"use strict";

const orderModel = require("../models/orderModel");

function viewOrderHistory(req, res) {
  const userId = req.session.user.id;
  const orders = orderModel.getOrdersByUser(userId);

  const orderDetails = orders.map(order => {
    const items = orderModel.getOrderItems(order.order_id);
    return { ...order, items };
  });

  res.render("order-history", { orders: orderDetails, user: req.session.user });
}

module.exports = {
  viewOrderHistory
};
