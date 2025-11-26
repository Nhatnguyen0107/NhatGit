import db from './src/models/index.js';

async function checkData() {
    try {
        const productCount = await db.Product.count();
        const categoryCount = await db.Category.count();
        const userCount = await db.User.count();
        const customerCount = await db.Customer.count();

        console.log('=== DATABASE DATA CHECK ===');
        console.log(`Products: ${productCount}`);
        console.log(`Categories: ${categoryCount}`);
        console.log(`Users: ${userCount}`);
        console.log(`Customers: ${customerCount}`);

        if (productCount > 0) {
            const products = await db.Product.findAll({
                limit: 3,
                attributes: ['id', 'name', 'price', 'status']
            });
            console.log('\nSample Products:');
            products.forEach(p => console.log(`  - ${p.name} (${p.status})`));
        }

        if (categoryCount > 0) {
            const categories = await db.Category.findAll({
                limit: 3,
                attributes: ['id', 'name']
            });
            console.log('\nSample Categories:');
            categories.forEach(c => console.log(`  - ${c.name}`));
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkData();
