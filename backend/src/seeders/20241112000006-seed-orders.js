import { v4 as uuidv4 } from 'uuid';

export default {
    async up(queryInterface, Sequelize) {
        // Get customers
        const customers = await queryInterface.sequelize.query(
            `SELECT id FROM customers ORDER BY created_at`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        // Get some products
        const products = await queryInterface.sequelize.query(
            `SELECT id, name, price FROM products LIMIT 10`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (customers.length === 0 || products.length === 0) {
            throw new Error(
                'No customers or products found. Run previous seeders first.'
            );
        }

        const orders = [];
        const orderItems = [];

        // Order 1 - Delivered
        const order1Id = uuidv4();
        const order1Subtotal =
            parseFloat(products[0].price) * 1 +
            parseFloat(products[1].price) * 2;
        const order1Discount = order1Subtotal * 0.05;
        const order1Shipping = 15.00;
        const order1Total =
            order1Subtotal - order1Discount + order1Shipping;

        orders.push({
            id: order1Id,
            order_number: 'ORD-2024-0001',
            customer_id: customers[0].id,
            status: 'delivered',
            subtotal: order1Subtotal.toFixed(2),
            discount_amount: order1Discount.toFixed(2),
            shipping_cost: order1Shipping.toFixed(2),
            total_amount: order1Total.toFixed(2),
            payment_method: 'Credit Card',
            payment_status: 'paid',
            shipping_address: '123 Main Street, Apt 4B, New York, USA 10001',
            notes: 'Please leave at front door',
            shipped_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            delivered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        });

        orderItems.push(
            {
                id: uuidv4(),
                order_id: order1Id,
                product_id: products[0].id,
                product_name: products[0].name,
                product_price: products[0].price,
                quantity: 1,
                discount_percentage: 5.00,
                subtotal: (parseFloat(products[0].price) * 0.95).toFixed(2),
                created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            },
            {
                id: uuidv4(),
                order_id: order1Id,
                product_id: products[1].id,
                product_name: products[1].name,
                product_price: products[1].price,
                quantity: 2,
                discount_percentage: 5.00,
                subtotal: (parseFloat(products[1].price) * 2 * 0.95).toFixed(2),
                created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
        );

        // Order 2 - Shipped
        const order2Id = uuidv4();
        const order2Subtotal =
            parseFloat(products[2].price) * 1 +
            parseFloat(products[3].price) * 1;
        const order2Discount = order2Subtotal * 0.10;
        const order2Shipping = 20.00;
        const order2Total =
            order2Subtotal - order2Discount + order2Shipping;

        orders.push({
            id: order2Id,
            order_number: 'ORD-2024-0002',
            customer_id: customers[1].id,
            status: 'shipped',
            subtotal: order2Subtotal.toFixed(2),
            discount_amount: order2Discount.toFixed(2),
            shipping_cost: order2Shipping.toFixed(2),
            total_amount: order2Total.toFixed(2),
            payment_method: 'PayPal',
            payment_status: 'paid',
            shipping_address: '789 Pine Road, San Francisco, USA 94102',
            notes: 'Signature required',
            shipped_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            delivered_at: null,
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        });

        orderItems.push(
            {
                id: uuidv4(),
                order_id: order2Id,
                product_id: products[2].id,
                product_name: products[2].name,
                product_price: products[2].price,
                quantity: 1,
                discount_percentage: 10.00,
                subtotal: (parseFloat(products[2].price) * 0.90).toFixed(2),
                created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                id: uuidv4(),
                order_id: order2Id,
                product_id: products[3].id,
                product_name: products[3].name,
                product_price: products[3].price,
                quantity: 1,
                discount_percentage: 10.00,
                subtotal: (parseFloat(products[3].price) * 0.90).toFixed(2),
                created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            }
        );

        // Order 3 - Processing
        const order3Id = uuidv4();
        const order3Subtotal = parseFloat(products[4].price) * 3;
        const order3Discount = 0;
        const order3Shipping = 10.00;
        const order3Total =
            order3Subtotal - order3Discount + order3Shipping;

        orders.push({
            id: order3Id,
            order_number: 'ORD-2024-0003',
            customer_id: customers[2].id,
            status: 'processing',
            subtotal: order3Subtotal.toFixed(2),
            discount_amount: order3Discount.toFixed(2),
            shipping_cost: order3Shipping.toFixed(2),
            total_amount: order3Total.toFixed(2),
            payment_method: 'Credit Card',
            payment_status: 'paid',
            shipping_address: '321 Elm Street, Chicago, USA 60601',
            notes: null,
            shipped_at: null,
            delivered_at: null,
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        });

        orderItems.push({
            id: uuidv4(),
            order_id: order3Id,
            product_id: products[4].id,
            product_name: products[4].name,
            product_price: products[4].price,
            quantity: 3,
            discount_percentage: 0.00,
            subtotal: (parseFloat(products[4].price) * 3).toFixed(2),
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        });

        // Order 4 - Pending
        const order4Id = uuidv4();
        const order4Subtotal =
            parseFloat(products[5].price) * 1 +
            parseFloat(products[6].price) * 2;
        const order4Discount = 0;
        const order4Shipping = 15.00;
        const order4Total =
            order4Subtotal - order4Discount + order4Shipping;

        orders.push({
            id: order4Id,
            order_number: 'ORD-2024-0004',
            customer_id: customers[0].id,
            status: 'pending',
            subtotal: order4Subtotal.toFixed(2),
            discount_amount: order4Discount.toFixed(2),
            shipping_cost: order4Shipping.toFixed(2),
            total_amount: order4Total.toFixed(2),
            payment_method: 'Credit Card',
            payment_status: 'pending',
            shipping_address: '123 Main Street, Apt 4B, New York, USA 10001',
            notes: 'Call before delivery',
            shipped_at: null,
            delivered_at: null,
            created_at: new Date(),
            updated_at: new Date()
        });

        orderItems.push(
            {
                id: uuidv4(),
                order_id: order4Id,
                product_id: products[5].id,
                product_name: products[5].name,
                product_price: products[5].price,
                quantity: 1,
                discount_percentage: 0.00,
                subtotal: parseFloat(products[5].price).toFixed(2),
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                order_id: order4Id,
                product_id: products[6].id,
                product_name: products[6].name,
                product_price: products[6].price,
                quantity: 2,
                discount_percentage: 0.00,
                subtotal: (parseFloat(products[6].price) * 2).toFixed(2),
                created_at: new Date(),
                updated_at: new Date()
            }
        );

        // Order 5 - Cancelled
        const order5Id = uuidv4();
        const order5Subtotal = parseFloat(products[7].price) * 1;
        const order5Discount = 0;
        const order5Shipping = 10.00;
        const order5Total =
            order5Subtotal - order5Discount + order5Shipping;

        orders.push({
            id: order5Id,
            order_number: 'ORD-2024-0005',
            customer_id: customers[1].id,
            status: 'cancelled',
            subtotal: order5Subtotal.toFixed(2),
            discount_amount: order5Discount.toFixed(2),
            shipping_cost: order5Shipping.toFixed(2),
            total_amount: order5Total.toFixed(2),
            payment_method: 'Credit Card',
            payment_status: 'refunded',
            shipping_address: '456 Oak Avenue, Los Angeles, USA 90001',
            notes: 'Customer requested cancellation',
            shipped_at: null,
            delivered_at: null,
            created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        });

        orderItems.push({
            id: uuidv4(),
            order_id: order5Id,
            product_id: products[7].id,
            product_name: products[7].name,
            product_price: products[7].price,
            quantity: 1,
            discount_percentage: 0.00,
            subtotal: parseFloat(products[7].price).toFixed(2),
            created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        });

        // Insert orders and order items
        await queryInterface.bulkInsert('orders', orders, {});
        await queryInterface.bulkInsert('order_items', orderItems, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('order_items', null, {});
        await queryInterface.bulkDelete('orders', null, {});
    }
};
