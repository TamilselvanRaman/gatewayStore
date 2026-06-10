const fs = require('fs');
const path = require('path');

const srcProduct = 'C:\\Users\\TAMILSELVAN RAMAN\\.gemini\\antigravity-ide\\brain\\f1ad3719-c47f-4a0e-a1ed-6a052e252646\\gateway_product_1781066442949.png';
const srcBanner = 'C:\\Users\\TAMILSELVAN RAMAN\\.gemini\\antigravity-ide\\brain\\f1ad3719-c47f-4a0e-a1ed-6a052e252646\\gateway_banner_1781066427855.png';

const destDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const productImages = [
  'laptop1.png',
  'laptop2.png',
  'phone1.png',
  'phone2.png',
  'audio1.png',
  'audio2.png',
  'accessory1.png',
  'accessory2.png',
  'default-product.png'
];

const categoryImages = [
  'cat-laptops.png',
  'cat-smartphones.png',
  'cat-audio.png',
  'cat-accessories.png',
  'default-category.png'
];

try {
  // Copy product images
  if (fs.existsSync(srcProduct)) {
    productImages.forEach(imgName => {
      fs.copyFileSync(srcProduct, path.join(destDir, imgName));
    });
    categoryImages.forEach(imgName => {
      fs.copyFileSync(srcProduct, path.join(destDir, imgName));
    });
    console.log('Product and Category images copied successfully!');
  } else {
    console.error('Source product image not found:', srcProduct);
  }

  // Copy banner image
  if (fs.existsSync(srcBanner)) {
    fs.copyFileSync(srcBanner, path.join(destDir, 'banner.png'));
    console.log('Banner image copied successfully!');
  } else {
    console.error('Source banner image not found:', srcBanner);
  }
} catch (error) {
  console.error('Error copying files:', error.message);
}
