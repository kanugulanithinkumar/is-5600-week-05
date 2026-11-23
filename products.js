const cuid = require('cuid')
const db = require('./db')

const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: String,
  alt_description: String,
  likes: { type: Number, required: true },
  urls: {
    regular: { type: String, required: true },
    small: { type: String, required: true },
    thumb: { type: String, required: true }
  },
  links: {
    self: { type: String, required: true },
    html: { type: String, required: true }
  },
  user: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: String,
    portfolio_url: String,
    username: { type: String, required: true }
  },
  tags: [{ title: { type: String, required: true } }]
})

async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options
  const query = tag ? { 'tags.title': tag } : {}

  return Product.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)
}

async function get(id) {
  return Product.findById(id)
}

async function create(fields) {
  return new Product(fields).save()
}

async function edit(id, changes) {
  const product = await get(id)
  if (!product) {
    return null
  }

  product.set(changes)
  return product.save()
}

async function destroy(id) {
  return Product.deleteOne({ _id: id })
}

module.exports = { list, get, create, edit, destroy }