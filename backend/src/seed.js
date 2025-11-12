import db from './models/index.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const {
    Role, User, Category, Product, Customer, Order, OrderItem
} = db;

const runSeeders = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await OrderItem.destroy({ where: {}, force: true });
        await Order.destroy({ where: {}, force: true });
        await Customer.destroy({ where: {}, force: true });
        await Product.destroy({ where: {}, force: true });
        await Category.destroy({ where: {}, force: true });
        await User.destroy({ where: {}, force: true });
        await Role.destroy({ where: {}, force: true });
        console.log('✅ Existing data cleared\n');

        // Seed Roles
        console.log('📋 Seeding roles...');
        const roles = await Role.bulkCreate([
            {
                id: 1, name: 'Admin',
                description: 'Full system access'
            },
            {
                id: 2, name: 'Staff',
                description: 'Limited access - orders & customers'
            },
            {
                id: 3, name: 'Customer',
                description: 'Customer access'
            }
        ]);
        console.log(`✅ Created ${roles.length} roles\n`);

        // Seed Users
        console.log('👤 Seeding users...');
        const hashedPassword = await bcrypt.hash('123456', 10);
        const users = await User.bulkCreate([
            {
                id: uuidv4(),
                email: 'admin@ecommerce.com',
                password: hashedPassword,
                role_id: 1,
                is_active: true
            },
            {
                id: uuidv4(),
                email: 'staff@ecommerce.com',
                password: hashedPassword,
                role_id: 2,
                is_active: true
            },
            {
                id: uuidv4(),
                email: 'customer1@example.com',
                password: hashedPassword,
                role_id: 3,
                is_active: true
            },
            {
                id: uuidv4(),
                email: 'customer2@example.com',
                password: hashedPassword,
                role_id: 3,
                is_active: true
            },
            {
                id: uuidv4(),
                email: 'customer3@example.com',
                password: hashedPassword,
                role_id: 3,
                is_active: true
            }
        ]);
        console.log(`✅ Created ${users.length} users\n`);

        // Seed Categories
        console.log('📁 Seeding categories...');
        const categories = await Category.bulkCreate([
            {
                name: 'Laptops', slug: 'laptops',
                description: 'Portable computers', is_active: true
            },
            {
                name: 'Desktop PCs', slug: 'desktop-pcs',
                description: 'Desktop computers', is_active: true
            },
            {
                name: 'Monitors', slug: 'monitors',
                description: 'Display monitors', is_active: true
            },
            {
                name: 'Keyboards & Mice', slug: 'keyboards-mice',
                description: 'Input devices', is_active: true
            },
            {
                name: 'Storage Devices', slug: 'storage-devices',
                description: 'SSDs & HDDs', is_active: true
            },
            {
                name: 'Networking', slug: 'networking',
                description: 'Routers & switches', is_active: true
            },
            {
                name: 'Accessories', slug: 'accessories',
                description: 'Cables & adapters', is_active: true
            }
        ]);
        console.log(`✅ Created ${categories.length} categories\n`);

        // Seed Products (Sample - you can add more)
        console.log('🛍️  Seeding products...');
        const products = await Product.bulkCreate([
            {
                name: 'Dell XPS 13',
                slug: 'dell-xps-13',
                description: '13.4" FHD+, Intel i7, 16GB RAM',
                price: 1299.99,
                stock_quantity: 25,
                category_id: 1,
                brand: 'Dell',
                discount_percentage: 10
            },
            {
                name: 'MacBook Pro 14"',
                slug: 'macbook-pro-14',
                description: '14" Retina, M2 Pro, 16GB RAM',
                price: 1999.00,
                stock_quantity: 15,
                category_id: 1,
                brand: 'Apple',
                discount_percentage: 5
            },
            {
                name: 'Gaming PC RTX 4070',
                slug: 'gaming-pc-rtx-4070',
                description: 'i7-13700K, RTX 4070, 32GB DDR5',
                price: 2199.00,
                stock_quantity: 12,
                category_id: 2,
                brand: 'Custom Build',
                discount_percentage: 8
            },
            {
                name: 'LG UltraGear 27"',
                slug: 'lg-ultragear-27',
                description: '27" 4K, 144Hz, Gaming Monitor',
                price: 599.99,
                stock_quantity: 35,
                category_id: 3,
                brand: 'LG',
                discount_percentage: 10
            },
            {
                name: 'Logitech MX Keys',
                slug: 'logitech-mx-keys',
                description: 'Wireless Illuminated Keyboard',
                price: 99.99,
                stock_quantity: 60,
                category_id: 4,
                brand: 'Logitech',
                discount_percentage: 12
            },
            {
                name: 'Samsung 980 PRO 1TB',
                slug: 'samsung-980-pro-1tb',
                description: 'NVMe M.2 SSD, 7000MB/s',
                price: 129.99,
                stock_quantity: 55,
                category_id: 5,
                brand: 'Samsung',
                discount_percentage: 18
            },
            {
                name: 'TP-Link WiFi 6 Router',
                slug: 'tp-link-wifi-6-router',
                description: 'AX6000, 8 Streams, MU-MIMO',
                price: 279.99,
                stock_quantity: 20,
                category_id: 6,
                brand: 'TP-Link',
                discount_percentage: 10
            },
            {
                name: 'USB-C Hub 7-in-1',
                slug: 'usb-c-hub-7in1',
                description: 'HDMI, USB 3.0, SD Card Reader',
                price: 39.99,
                stock_quantity: 100,
                category_id: 7,
                brand: 'Cable Matters',
                discount_percentage: 20
            }
        ]);
        console.log(`✅ Created ${products.length} products\n`);

        // Seed Customers
        console.log('👥 Seeding customers...');
        const customerUsers = users.filter(u => u.role_id === 3);
        const customers = await Customer.bulkCreate([
            {
                user_id: customerUsers[0].id,
                first_name: 'John',
                last_name: 'Doe',
                phone: '+1-555-0101',
                billing_address: '123 Main Street',
                billing_city: 'New York',
                billing_country: 'USA',
                billing_postal_code: '10001',
                shipping_address: '123 Main Street',
                shipping_city: 'New York',
                shipping_country: 'USA',
                shipping_postal_code: '10001',
                discount_percentage: 5
            },
            {
                user_id: customerUsers[1].id,
                first_name: 'Jane',
                last_name: 'Smith',
                phone: '+1-555-0102',
                billing_address: '456 Oak Avenue',
                billing_city: 'Los Angeles',
                billing_country: 'USA',
                billing_postal_code: '90001',
                shipping_address: '789 Pine Road',
                shipping_city: 'San Francisco',
                shipping_country: 'USA',
                shipping_postal_code: '94102',
                discount_percentage: 10
            },
            {
                user_id: customerUsers[2].id,
                first_name: 'Michael',
                last_name: 'Johnson',
                phone: '+1-555-0103',
                billing_address: '321 Elm Street',
                billing_city: 'Chicago',
                billing_country: 'USA',
                billing_postal_code: '60601',
                shipping_address: '321 Elm Street',
                shipping_city: 'Chicago',
                shipping_country: 'USA',
                shipping_postal_code: '60601',
                discount_percentage: 0
            }
        ]);
        console.log(`✅ Created ${customers.length} customers\n`);

        // Seed Orders
        console.log('📦 Seeding orders...');
        const order1 = await Order.create({
            order_number: 'ORD-2024-0001',
            customer_id: customers[0].id,
            status: 'delivered',
            subtotal: 1399.98,
            discount_amount: 69.99,
            shipping_cost: 15.00,
            total_amount: 1344.99,
            payment_method: 'Credit Card',
            payment_status: 'paid',
            shipping_address: '123 Main Street, New York, USA',
            notes: 'Please leave at front door',
            shipped_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            delivered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        });

        await OrderItem.bulkCreate([
            {
                order_id: order1.id,
                product_id: products[0].id,
                product_name: products[0].name,
                product_price: products[0].price,
                quantity: 1,
                discount_percentage: 10,
                subtotal: 1169.99
            },
            {
                order_id: order1.id,
                product_id: products[4].id,
                product_name: products[4].name,
                product_price: products[4].price,
                quantity: 2,
                discount_percentage: 12,
                subtotal: 175.98
            }
        ]);

        const order2 = await Order.create({
            order_number: 'ORD-2024-0002',
            customer_id: customers[1].id,
            status: 'processing',
            subtotal: 2199.00,
            discount_amount: 0,
            shipping_cost: 20.00,
            total_amount: 2219.00,
            payment_method: 'PayPal',
            payment_status: 'paid',
            shipping_address: '789 Pine Road, San Francisco, USA',
            notes: null
        });

        await OrderItem.create({
            order_id: order2.id,
            product_id: products[2].id,
            product_name: products[2].name,
            product_price: products[2].price,
            quantity: 1,
            discount_percentage: 0,
            subtotal: 2199.00
        });

        console.log('✅ Created 2 sample orders with items\n');

        console.log('🎉 Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - Roles: ${roles.length}`);
        console.log(`   - Users: ${users.length}`);
        console.log(`   - Categories: ${categories.length}`);
        console.log(`   - Products: ${products.length}`);
        console.log(`   - Customers: ${customers.length}`);
        console.log(`   - Orders: 2`);
        console.log('\n🔑 Login credentials:');
        console.log('   Admin: admin@ecommerce.com / 123456');
        console.log('   Staff: staff@ecommerce.com / 123456');
        console.log('   Customer: customer1@example.com / 123456\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

runSeeders();
