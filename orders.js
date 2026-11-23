const cuid = require('cuid')
const db = require('./db')

const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  buyerEmail: { type: String, required: true },
  products: [{
    type: String,
    ref: 'Product',
    index: true,
    required: true
  }],
  status: {
    type: String,
    index: true,
    default: 'CREATED',
    enum: ['CREATED', 'PENDING', 'COMPLETED']
  }
})

async function list(options = {}) {
  const { offset = 0, limit = 25, productId, status } = options
  const query = {}

  if (productId) query.products = productId
  if (status) query.status = status

  return Order.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)
}

async function get(id) {
  return Order.findById(id).populate('products')
}

async function create(fields) {
  const order = await new Order(fields).save()
  return order.populate('products')
}

async function edit(id, changes) {
  const order = await Order.findById(id)
  if (!order) {
    return null
  }

  order.set(changes)
  await order.save()
  return order.populate('products')
}

async function destroy(id) {
  await Order.deleteOne({ _id: id })
}

module.exports = { list, get, create, edit, destroy }  