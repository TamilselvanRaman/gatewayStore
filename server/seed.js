const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

dotenv.config();

const categoriesData = [
  { name: 'Computing', image: 'cat-laptops.png' },
  { name: 'Audio', image: 'cat-audio.png' },
  { name: 'Accessories', image: 'cat-accessories.png' },
  { name: 'Photography', image: 'cat-photography.png' }
];

const getProductsData = (categoryIds) => [
  {
    title: 'Lumina X-Pro Camera',
    description: 'Professional DSLR camera featuring 45MP full-frame sensor, 8K video recording, and advanced autofocus. Built for visual storytellers and photography professionals.',
    category: categoryIds['Photography'],
    brand: 'Photography',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop'],
    price: 1599,
    discountPrice: 1299,
    stock: 15,
    rating: 4.8
  },
  {
    title: 'Zenith ANC Headphones',
    description: 'Premium active noise-cancelling wireless headphones with custom high-fidelity drivers, 40 hours of battery life, and crystal-clear call quality.',
    category: categoryIds['Audio'],
    brand: 'Audio',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'],
    price: 349,
    discountPrice: 0,
    stock: 25,
    rating: 4.5
  },
  {
    title: 'Classic Minimal Watch',
    description: 'Elegant minimalist timepiece with surgical-grade stainless steel case, genuine Italian leather strap, and precise Swiss quartz movement.',
    category: categoryIds['Accessories'],
    brand: 'Accessories',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'],
    price: 189,
    discountPrice: 0,
    stock: 40,
    rating: 4.7
  },
  {
    title: 'ApexBook Pro 14 Laptop',
    description: 'Ultra-thin computing powerhouse with 14-inch Liquid Retina display, 10-core CPU, 16GB unified memory, and 512GB SSD. Perfect for professional workflows.',
    category: categoryIds['Computing'],
    brand: 'Computing',
    images: ['https://images.unsplash.com/photo-1496181130204-7552cc14bac4?q=80&w=600&auto=format&fit=crop'],
    price: 1899,
    discountPrice: 0,
    stock: 8,
    rating: 4.9
  },
  {
    title: 'Specter Gaming V2',
    description: 'Ultimate esports laptop featuring high-refresh-rate display, RTX graphics, liquid cooling system, and mechanical keyboard. Unleash maximum framerates.',
    category: categoryIds['Computing'],
    brand: 'Computing',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop'],
    price: 2499,
    discountPrice: 2299,
    stock: 12,
    rating: 4.8
  },
  {
    title: 'BassBlast Outdoor Speaker',
    description: 'Rugged, IPX7 waterproof portable speaker with rich bass, dual drivers, and 24-hour playtime. Bring the party anywhere.',
    category: categoryIds['Audio'],
    brand: 'Audio',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&auto=format&fit=crop'],
    price: 129,
    discountPrice: 99,
    stock: 35,
    rating: 4.4
  },
  {
    title: 'Gateway Wireless Combo',
    description: 'Ergonomic keyboard and mouse set with whisper-quiet keys, long-range 2.4GHz wireless connection, and extended battery life.',
    category: categoryIds['Accessories'],
    brand: 'Accessories',
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop'],
    price: 79,
    discountPrice: 59,
    stock: 100,
    rating: 4.6
  },
  {
    title: 'AeroPro Action Cam',
    description: 'Waterproof 4K ultra-HD action camera with optical image stabilization, wide-angle lens, and multiple mount accessories.',
    category: categoryIds['Photography'],
    brand: 'Photography',
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=600&auto=format&fit=crop'],
    price: 299,
    discountPrice: 249,
    stock: 30,
    rating: 4.3
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gateway_store');
    console.log('Seed connection active...');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleaned database documents.');

    const adminUser = new User({
      name: 'Admin Gateway',
      email: 'admin@gateway.com',
      phone: '9876543210',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();

    const customerUser = new User({
      name: 'John Doe',
      email: 'user@gateway.com',
      phone: '8765432109',
      password: 'user123',
      role: 'customer',
      address: [
        {
          street: '123 Tech Park, Phase 1',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          zipCode: '641006',
          country: 'India'
        }
      ]
    });
    await customerUser.save();
    console.log('Seeded Users: admin@gateway.com & user@gateway.com');

    const categoriesMap = {};
    for (const cat of categoriesData) {
      const createdCat = await Category.create(cat);
      categoriesMap[cat.name] = createdCat._id;
    }
    console.log('Seeded Categories successfully');

    const products = getProductsData(categoriesMap);
    await Product.insertMany(products);
    console.log('Seeded Products successfully');

    console.log('Database Seeding Complete! 🎉');
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();