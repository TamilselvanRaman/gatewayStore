const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 9
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    let sortQuery = { createdAt: -1 };
    if (sort) {
      if (sort === 'priceAsc') sortQuery = { price: 1 };
      else if (sort === 'priceDesc') sortQuery = { price: -1 };
      else if (sort === 'rating') sortQuery = { rating: -1 };
      else if (sort === 'oldest') sortQuery = { createdAt: 1 };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skipNum = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sortQuery)
      .skip(skipNum)
      .limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      pagination: {
        totalProducts: total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        limit: limitNum
      },
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id }
    }).limit(4);

    res.json({
      success: true,
      data: product,
      related: relatedProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, description, category, brand, price, discountPrice, stock, rating } = req.body;

    if (!title || !description || !category || !brand || !price) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.filename);
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else {
      images = ['default-product.png'];
    }

    const product = await Product.create({
      title,
      description,
      category,
      brand,
      images,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: stock ? Number(stock) : 0,
      rating: rating ? Number(rating) : 5
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { title, description, category, brand, price, discountPrice, stock, rating, deleteExistingImages } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      product.category = category;
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.price = price !== undefined ? Number(price) : product.price;
    product.discountPrice = discountPrice !== undefined ? Number(discountPrice) : product.discountPrice;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.rating = rating !== undefined ? Number(rating) : product.rating;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);

      if (deleteExistingImages === 'true' || deleteExistingImages === true) {
        product.images.forEach(img => {
          if (img !== 'default-product.png' && !img.startsWith('http')) {
            const imagePath = path.join(__dirname, '../uploads', img);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }
        });
        product.images = newImages;
      } else {
        if (product.images.length === 1 && product.images[0] === 'default-product.png') {
          product.images = newImages;
        } else {
          product.images = [...product.images, ...newImages];
        }
      }
    } else if (req.body.images) {
      const newImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      if (deleteExistingImages === 'true' || deleteExistingImages === true) {
        product.images.forEach(img => {
          if (img !== 'default-product.png' && !img.startsWith('http')) {
            const imagePath = path.join(__dirname, '../uploads', img);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }
        });
        product.images = newImages;
      } else {
        if (product.images.length === 1 && product.images[0] === 'default-product.png') {
          product.images = newImages;
        } else {
          product.images = [...product.images, ...newImages];
        }
      }
    }

    const updatedProduct = await product.save();
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.images.forEach(img => {
      if (img !== 'default-product.png' && !img.startsWith('http')) {
        const imagePath = path.join(__dirname, '../uploads', img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    });

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};