
const Product = require('../models/productModel')
const cloudinary = require('cloudinary').v2

    cloudinary.config({ 
        cloud_name: 'dea3u3plr', 
        api_key: '915639424628459', 
        api_secret: 'pACRwoOSFU_6awkt8b1hlt3r2Pw' 
    });

// -----------------------create product ----------------------
const createProduct = async (req, res) => {
  try {
    const { name, price, description, image } = req.body

    if (!name || !price) {
      return res.status(400).send('Required fields missing')
    }

    let imageUrl = null

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path)
      imageUrl = upload.secure_url
    }

    const product = new Product({
      name,
      price,
      description,
      image: imageUrl
    }).save()
    await product.save()
    res.status(201).send(product)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

// -------------------------- GET ALL PRODUCTS ---------------------
const getAllProducts = async (req, res) => {
  const products = await Product.find()
  res.send(products)
}

// -------------------------- GET SINGLE PRODUCT --------------------------
const getSingleProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).send('Product not found')
  res.send(product)
}

// --------------------------- UPDATE PRODUCT ----------------------------
const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  if (!product) return res.status(404).send('Product not found')
  res.send(product)
}

// ----------------------------  DELETE PRODUCT ----------------------------
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) return res.status(404).send('Product not found')
  res.send('Product deleted')
}

module.exports = { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct}