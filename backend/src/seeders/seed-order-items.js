import db from '../models/index.js';

const seedOrderItems = async () => {
    try {
        console.log('🌱 Seeding order items...');

        // Get orders and products
        const orders = await db.Order.findAll({ limit: 10 });
        const products = await db.Product.findAll({ limit: 10 });

        if (orders.length === 0 || products.length === 0) {
            console.log('⚠️ No orders or products found. Please seed orders and products first.');
            return;
        }

        const orderItems = [];

        // Create order items for each order
        for (const order of orders) {
            // Random 1-3 items per order
            const itemCount = Math.floor(Math.random() * 3) + 1;

            for (let i = 0; i < itemCount; i++) {
                const product = products[Math.floor(Math.random() * products.length)];
                const quantity = Math.floor(Math.random() * 3) + 1;
                const productPrice = parseFloat(product.price);
                const discountPercentage = Math.random() > 0.7 ? 10 : 0;
                const subtotal = quantity * productPrice * (1 - discountPercentage / 100);

                orderItems.push({
                    order_id: order.id,
                    product_id: product.id,
                    quantity: quantity,
                    product_price: productPrice,
                    discount_percentage: discountPercentage,
                    subtotal: subtotal
                });
            }
        }

        await db.OrderItem.bulkCreate(orderItems);

        console.log(`✅ Seeded ${orderItems.length} order items successfully!`);
    } catch (error) {
        console.error('❌ Error seeding order items:', error);
        throw error;
    }
};

// Run seeder
seedOrderItems()
    .then(() => {
        console.log('✅ Order items seeding completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Order items seeding failed:', error);
        process.exit(1);
    });
