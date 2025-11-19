import sequelize from './config/index.js';
import Product from './models/Product.js';

async function updateProductImages() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database');

        // Get all products
        const products = await Product.findAll();

        if (products.length > 0) {
            let updated = 0;
            
            for (const product of products) {
                // Add 3 additional images for each product
                product.additional_images = [
                    '/uploads/products/image copy.png',
                    '/uploads/products/image copy 2.png',
                    '/uploads/products/image copy 3.png'
                ];
                await product.save();
                updated++;
            }
            
            console.log(`✅ Updated ${updated} products with additional images`);
        } else {
            console.log('❌ No products found');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateProductImages();
