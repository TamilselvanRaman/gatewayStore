const mongoose = require('mongoose');
const dotenv = require('dotenv');
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
    title: 'ApexBook Pro 14 Laptop',
    description: 'Ultra-thin computing powerhouse with 14-inch Liquid Retina display, 10-core CPU, 16GB unified memory, and 512GB SSD. Perfect for professional workflows and creative work.',
    category: categoryIds['Computing'],
    brand: 'ApexBook',
    images: ['https://images.unsplash.com/photo-1496181130204-7552cc14bac4?q=80&w=600&auto=format&fit=crop'],
    price: 1899,
    discountPrice: 1699,
    stock: 8,
    rating: 4.9
  },
  {
    title: 'Specter Gaming V2',
    description: 'Ultimate esports laptop featuring 144Hz high-refresh-rate display, RTX 4060 graphics, liquid cooling system, and RGB mechanical keyboard. Unleash maximum framerates.',
    category: categoryIds['Computing'],
    brand: 'Specter',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop'],
    price: 2499,
    discountPrice: 2299,
    stock: 12,
    rating: 4.8
  },
  {
    title: 'SlimPad Ultra Chromebook',
    description: 'Lightweight 13-inch Chromebook with all-day battery life, fast boot in 6 seconds, and seamless Google ecosystem integration. Ideal for students and remote workers.',
    category: categoryIds['Computing'],
    brand: 'SlimPad',
    images: ['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=600&auto=format&fit=crop'],
    price: 649,
    discountPrice: 549,
    stock: 20,
    rating: 4.5
  },

  {
    title: 'Zenith ANC Headphones',
    description: 'Premium active noise-cancelling wireless headphones with custom high-fidelity drivers, 40 hours of battery life, and crystal-clear call quality for professionals.',
    category: categoryIds['Audio'],
    brand: 'Zenith',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'],
    price: 349,
    discountPrice: 299,
    stock: 25,
    rating: 4.7
  },
  {
    title: 'BassBlast Outdoor Speaker',
    description: 'Rugged IPX7 waterproof portable Bluetooth speaker with 360° rich bass, dual passive radiators, and 24-hour playtime. Bring the party anywhere outdoors.',
    category: categoryIds['Audio'],
    brand: 'BassBlast',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&auto=format&fit=crop'],
    price: 129,
    discountPrice: 99,
    stock: 35,
    rating: 4.4
  },
  {
    title: 'SonicPure Earbuds Pro',
    description: 'True wireless in-ear earbuds with hybrid active noise cancellation, 10mm dynamic drivers, 8-hour playtime plus 24 hours with charging case, and IPX5 sweat resistance.',
    category: categoryIds['Audio'],
    brand: 'SonicPure',
    images: ['https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?q=80&w=600&auto=format&fit=crop'],
    price: 199,
    discountPrice: 159,
    stock: 50,
    rating: 4.6
  },

  {
    title: 'Gateway Wireless Keyboard & Mouse Combo',
    description: 'Ergonomic full-size keyboard and mouse set with whisper-quiet keys, 2.4GHz wireless, programmable buttons, and 12-month battery life on a single charge.',
    category: categoryIds['Accessories'],
    brand: 'Gateway',
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop'],
    price: 79,
    discountPrice: 59,
    stock: 100,
    rating: 4.6
  },
  {
    title: 'Classic Minimal Watch',
    description: 'Elegant minimalist timepiece with surgical-grade stainless steel case, genuine Italian leather strap, scratch-resistant sapphire crystal, and precise Swiss quartz movement.',
    category: categoryIds['Accessories'],
    brand: 'TimeCraft',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'],
    price: 189,
    discountPrice: 0,
    stock: 40,
    rating: 4.7
  },
  {
    title: 'UltraSlim Power Bank 20000mAh',
    description: 'High-capacity 20000mAh portable charger with 65W USB-C PD fast charging, dual USB-A ports, digital display, and airline-safe lithium polymer battery cells.',
    category: categoryIds['Accessories'],
    brand: 'ChargeMate',
    images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=600&auto=format&fit=crop'],
    price: 59,
    discountPrice: 45,
    stock: 75,
    rating: 4.5
  },

  {
    title: 'Lumina X-Pro DSLR Camera',
    description: 'Professional DSLR camera featuring 45MP full-frame sensor, 8K video recording, dual card slots, 5-axis in-body stabilization, and advanced AI autofocus tracking.',
    category: categoryIds['Photography'],
    brand: 'Lumina',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop'],
    price: 1599,
    discountPrice: 1299,
    stock: 15,
    rating: 4.8
  },
  {
    title: 'AeroPro Action Cam 4K',
    description: 'Waterproof 4K ultra-HD action camera with 6-axis optical image stabilization, 170° wide-angle lens, HyperSmooth technology, and multiple mounting accessories included.',
    category: categoryIds['Photography'],
    brand: 'AeroPro',
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=600&auto=format&fit=crop'],
    price: 299,
    discountPrice: 249,
    stock: 30,
    rating: 4.3
  },
  {
    title: 'VisionMirror Instant Print Camera',
    description: 'Retro-style instant print camera with built-in flash, automatic exposure control, self-timer, multiple shooting modes, and produces credit card-sized photos in 60 seconds.',
    category: categoryIds['Photography'],
    brand: 'VisionMirror',
    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop'],
    price: 149,
    discountPrice: 119,
    stock: 45,
    rating: 4.5
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI );
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
    console.log('Seeded 4 Categories successfully');

    const products = getProductsData(categoriesMap);
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} Products (3 per category) successfully`);

    console.log('Database Seeding Complete! 🎉');
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();