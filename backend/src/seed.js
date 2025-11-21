import db from './models/index.js';
import bcrypt from 'bcrypt';

const { Role, User, Category, Product, Customer, Order, OrderItem } = db;

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await OrderItem.destroy({ where: {} });
        await Order.destroy({ where: {} });
        await Customer.destroy({ where: {} });
        await Product.destroy({ where: {} });
        await Category.destroy({ where: {} });
        await User.destroy({ where: {} });
        await Role.destroy({ where: {} });
        console.log('✅ Existing data cleared\n');

        // 1. Seed Roles
        console.log('📋 Seeding roles...');
        const roles = await Role.bulkCreate([
            { id: 1, name: 'Admin', description: 'Administrator' },
            { id: 2, name: 'Staff', description: 'Staff member' },
            { id: 3, name: 'Customer', description: 'Customer' }
        ]);
        console.log(`✅ Created ${roles.length} roles\n`);

        // 2. Seed Users
        console.log('👤 Seeding users...');
        const hashedPassword = await bcrypt.hash('123456', 10);
        const users = await User.bulkCreate([
            {
                username: 'admin',
                email: 'admin@ecommerce.com',
                password: hashedPassword,
                full_name: 'Admin User',
                role_id: roles[0].id
            },
            {
                username: 'staff',
                email: 'staff@ecommerce.com',
                password: hashedPassword,
                full_name: 'Staff User',
                role_id: roles[1].id
            },
            {
                username: 'customer1',
                email: 'customer1@example.com',
                password: hashedPassword,
                full_name: 'Customer One',
                role_id: roles[2].id
            },
            {
                username: 'customer2',
                email: 'customer2@example.com',
                password: hashedPassword,
                full_name: 'Customer Two',
                role_id: roles[2].id
            },
            {
                username: 'nhat',
                email: 'nhat@example.com',
                password: hashedPassword,
                full_name: 'Nguyễn Văn Nhật',
                role_id: roles[0].id
            }
        ]);
        console.log(`✅ Created ${users.length} users\n`);

        // 3. Seed Categories
        console.log('📁 Seeding categories...');
        const categories = await Category.bulkCreate([
            {
                name: 'Laptop',
                slug: 'laptop',
                description: 'Laptop và máy tính xách tay',
                image_url: '/uploads/products/image.png',
                is_active: true
            },
            {
                name: 'Điện thoại',
                slug: 'dien-thoai',
                description: 'Smartphone và thiết bị di động',
                image_url: '/uploads/products/image copy.png',
                is_active: true
            },
            {
                name: 'Tablet',
                slug: 'tablet',
                description: 'Máy tính bảng',
                image_url: '/uploads/products/image copy 2.png',
                is_active: true
            },
            {
                name: 'Phụ kiện',
                slug: 'phu-kien',
                description: 'Phụ kiện điện tử',
                image_url: '/uploads/products/image copy 3.png',
                is_active: true
            },
            {
                name: 'Linh kiện PC',
                slug: 'linh-kien-pc',
                description: 'Linh kiện máy tính',
                image_url: '/uploads/products/image copy 4.png',
                is_active: true
            },
            {
                name: 'TV & Audio',
                slug: 'tv-audio',
                description: 'Tivi và thiết bị âm thanh',
                image_url: '/uploads/products/image copy 5.png',
                is_active: true
            },
            {
                name: 'Gaming',
                slug: 'gaming',
                description: 'Thiết bị chơi game',
                image_url: '/uploads/products/image copy 6.png',
                is_active: true
            }
        ]);
        console.log(`✅ Created ${categories.length} categories\n`);

        // 4. Seed Products
        console.log('🛍️  Seeding products...');
        const products = await Product.bulkCreate([
            {
                name: 'MacBook Pro 14" M3',
                slug: 'macbook-pro-14-m3',
                description: 'Chip M3 mạnh mẽ, màn hình Liquid Retina XDR 14 inch, RAM 16GB, SSD 512GB. Hiệu năng vượt trội cho công việc sáng tạo.',
                price: 45990000,
                stock_quantity: 25,
                category_id: categories[0].id,
                brand: 'Apple',
                image_url: '/uploads/products/image.png',
                discount_percentage: 5,
                is_active: true
            },
            {
                name: 'iPhone 15 Pro Max 256GB',
                slug: 'iphone-15-pro-max-256gb',
                description: 'Chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch, khung titan. Smartphone cao cấp nhất.',
                price: 34990000,
                stock_quantity: 50,
                category_id: categories[1].id,
                brand: 'Apple',
                image_url: '/uploads/products/image copy.png',
                discount_percentage: 3,
                is_active: true
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                slug: 'samsung-galaxy-s24-ultra',
                description: 'Snapdragon 8 Gen 3, camera 200MP, màn hình Dynamic AMOLED 6.8 inch, S Pen tích hợp.',
                price: 29990000,
                stock_quantity: 40,
                category_id: categories[1].id,
                brand: 'Samsung',
                image_url: '/uploads/products/image copy 2.png',
                discount_percentage: 8,
                is_active: true
            },
            {
                name: 'iPad Pro M2 11" 128GB',
                slug: 'ipad-pro-m2-11-128gb',
                description: 'Chip M2, màn hình Liquid Retina 11 inch, Apple Pencil gen 2, Magic Keyboard.',
                price: 21990000,
                stock_quantity: 30,
                category_id: categories[2].id,
                brand: 'Apple',
                image_url: '/uploads/products/image copy 3.png',
                discount_percentage: 0,
                is_active: true
            },
            {
                name: 'Dell XPS 15 i7-13700H',
                slug: 'dell-xps-15-i7-13700h',
                description: 'Intel Core i7-13700H, RAM 16GB, SSD 512GB, RTX 4050, màn hình 15.6" FHD+.',
                price: 38990000,
                stock_quantity: 15,
                category_id: categories[0].id,
                brand: 'Dell',
                image_url: '/uploads/products/image copy 4.png',
                discount_percentage: 10,
                is_active: true
            },
            {
                name: 'AirPods Pro Gen 2',
                slug: 'airpods-pro-gen-2',
                description: 'Chip H2, chống ồn chủ động cải tiến, âm thanh không gian, USB-C.',
                price: 6490000,
                stock_quantity: 100,
                category_id: categories[3].id,
                brand: 'Apple',
                image_url: '/uploads/products/image copy 5.png',
                discount_percentage: 0,
                is_active: true
            },
            {
                name: 'ASUS ROG Strix RTX 4070',
                slug: 'asus-rog-strix-rtx-4070',
                description: 'NVIDIA GeForce RTX 4070 12GB GDDR6X, Ray Tracing, DLSS 3.0.',
                price: 18990000,
                stock_quantity: 20,
                category_id: categories[4].id,
                brand: 'ASUS',
                image_url: '/uploads/products/image copy 6.png',
                discount_percentage: 15,
                is_active: true
            },
            {
                name: 'Sony WH-1000XM5',
                slug: 'sony-wh-1000xm5',
                description: 'Tai nghe chống ồn tốt nhất, âm thanh Hi-Res, pin 30 giờ.',
                price: 8990000,
                stock_quantity: 45,
                category_id: categories[3].id,
                brand: 'Sony',
                image_url: '/uploads/products/image copy 7.png',
                discount_percentage: 12,
                is_active: true
            }
        ]);
        console.log(`✅ Created ${products.length} products\n`);

        // 5. Seed Customers
        console.log('👥 Seeding customers...');
        const customers = await Customer.bulkCreate([
            {
                user_id: users[2].id,
                phone: '0123456789',
                address: '123 Nguyễn Huệ, Q1, TP.HCM',
                city: 'Hồ Chí Minh',
                district: 'Quận 1',
                ward: 'Phường Bến Nghé'
            },
            {
                user_id: users[3].id,
                phone: '0987654321',
                address: '456 Lê Lợi, Q3, TP.HCM',
                city: 'Hồ Chí Minh',
                district: 'Quận 3',
                ward: 'Phường 7'
            },
            {
                user_id: users[4].id,
                phone: '0909123456',
                address: '789 Trần Hưng Đạo, Q5, TP.HCM',
                city: 'Hồ Chí Minh',
                district: 'Quận 5',
                ward: 'Phường 10'
            }
        ]);
        console.log(`✅ Created ${customers.length} customers\n`);

        // 6. Seed Orders
        console.log('📦 Seeding orders...');
        const order1 = await Order.create({
            order_number: `ORD${Date.now()}001`,
            customer_id: customers[0].id,
            subtotal: 52980000,
            discount_amount: 0,
            shipping_cost: 0,
            total_amount: 52980000,
            status: 'pending',
            shipping_address: '123 Nguyễn Huệ, Q1, TP.HCM',
            payment_method: 'COD',
            payment_status: 'pending'
        });

        await OrderItem.bulkCreate([
            {
                order_id: order1.id,
                product_id: products[0].id,
                product_name: products[0].name,
                product_price: products[0].price,
                quantity: 1,
                discount_percentage: products[0].discount_percentage,
                subtotal: products[0].price
            },
            {
                order_id: order1.id,
                product_id: products[5].id,
                product_name: products[5].name,
                product_price: products[5].price,
                quantity: 1,
                discount_percentage: products[5].discount_percentage,
                subtotal: products[5].price
            }
        ]);

        const order2 = await Order.create({
            order_number: `ORD${Date.now()}002`,
            customer_id: customers[1].id,
            subtotal: 34990000,
            discount_amount: 0,
            shipping_cost: 30000,
            total_amount: 35020000,
            status: 'completed',
            shipping_address: '456 Lê Lợi, Q3, TP.HCM',
            payment_method: 'VNPAY',
            payment_status: 'paid'
        });

        await OrderItem.create({
            order_id: order2.id,
            product_id: products[1].id,
            product_name: products[1].name,
            product_price: products[1].price,
            quantity: 1,
            discount_percentage: products[1].discount_percentage,
            subtotal: products[1].price
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
        console.log('   Customer: customer1@example.com / 123456');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
