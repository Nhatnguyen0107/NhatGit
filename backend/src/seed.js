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
                image_url: '/uploads/categories/laptops.png',
                is_active: true
            },
            {
                name: 'Điện thoại',
                slug: 'dien-thoai',
                description: 'Smartphone và thiết bị di động',
                image_url: '/uploads/categories/dienthoai.png',
                is_active: true
            },
            {
                name: 'Tablet',
                slug: 'tablet',
                description: 'Máy tính bảng',
                image_url: '/uploads/categories/tablet.png',
                is_active: true
            },
            {
                name: 'Phụ kiện',
                slug: 'phu-kien',
                description: 'Phụ kiện điện tử',
                image_url: '/uploads/categories/phukien.png',
                is_active: true
            },
            {
                name: 'Linh kiện PC',
                slug: 'linh-kien-pc',
                description: 'Linh kiện máy tính',
                image_url: '/uploads/categories/linhkien.png',
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
                name: 'Apple MacBook Air M2 2024',
                slug: 'Apple MacBook Air M2 2024',
                description:
                    'Apple Macbook Air M2 2024 16GB 256GB thiết kế siêu mỏng 1.13cm, trang bị chip M2 8 nhân GPU, 16 nhân Neural Engine, RAM khủng 16GB, SSD 256GB, màn hình IPS Liquid Retina Display cùng hệ thống 4 loa cho trải nghiệm đỉnh cao.',
                price: 19190000,
                stock_quantity: 15,
                category_id: 1,
                brand: 'Apple',
                image_url: '/uploads/products/laptop.png',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'MacBook Air M4 13 inch 2025',
                slug: 'MacBook Air M4 13 inch 2025',
                description:
                    'MacBook Air M4 13 inch 2025 10CPU 8GPU 16GB 256GB với cấu hình được xây dựng quanh chip Apple M4 thế hệ mới nhất, mang đến hiệu năng ấn tượng. Với 10 nhân CPU, chiếc MacBook Air M4 này cung cấp khả năng xử lý đa tác vụ nhanh chóng, mượt mà, từ công việc văn phòng, học tập đến duyệt web hay các ứng dụng sáng tạo. 8 nhân GPU tích hợp đảm bảo hiệu suất đồ họa tốt, đủ sức mạnh cho việc chỉnh sửa ảnh, biên tập video cơ bản và trải nghiệm giải trí sống động.',
                price: 22990000,
                stock_quantity: 15,
                category_id: 1,
                brand: 'Apple',
                image_url: '/uploads/products/laptop1.png',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },

            // điện thoại 
            {
                name: 'Điện thoại iPhone 16 Pro Max 256GB',
                slug: 'Điện thoại iPhone 16 Pro Max 256GB',
                description:
                    'Điện thoại iPhone 16 Pro Max 256GB với màn hình 6.7" Super Retina XDR, chip A17 Bionic, RAM 8GB, bộ nhớ trong 256GB. Camera Pro với nhiều tính năng chụp ảnh chuyên nghiệp, pin lâu dài, thiết kế sang trọng.',
                price: 30590000,
                stock_quantity: 15,
                category_id: 2,
                brand: 'Apple',
                image_url: '/uploads/products/dienthoai.png',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },

            {
                name: 'iPhone 17 256GB | Chính hãng',
                slug: 'iphone-17-256gb-chinh-hang',
                description:
                    'Điện thoại iPhone 17 256GB với màn hình 6.7" Super Retina XDR, chip A17 Bionic, RAM 8GB, bộ nhớ trong 256GB. Camera Pro với nhiều tính năng chụp ảnh chuyên nghiệp, pin lâu dài, thiết kế sang trọng.',
                price: 30590000,
                stock_quantity: 15,
                category_id: 2,
                brand: 'Apple',
                image_url: '/uploads/products/dienthoai1.png',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },

            {
                name: 'iPhone 17 Pro 256GB | Chính hãng',
                slug: 'iphone-17-pro-256gb-chinh-hang',
                description:
                    'Điện thoại iPhone 17 Pro 256GB với màn hình 6.7" Super Retina XDR, chip A17 Bionic, RAM 8GB, bộ nhớ trong 256GB. Camera Pro với nhiều tính năng chụp ảnh chuyên nghiệp, pin lâu dài, thiết kế sang trọng.',
                price: 30590000,
                stock_quantity: 15,
                category_id: 2,
                brand: 'Apple',
                image_url: '/uploads/products/dienthoai2.png',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'OPPO Find X9 12GB 256GB',
                slug: 'oppo-find-x9-12gb-256gb',
                description:
                    'Điện thoại OPPO Find X9 với màn hình 6.7" Super Retina XDR, chip A17 Bionic, RAM 8GB, bộ nhớ trong 256GB. Camera Pro với nhiều tính năng chụp ảnh chuyên nghiệp, pin lâu dài, thiết kế sang trọng.',
                price: 30590000,
                stock_quantity: 15,
                category_id: 2,
                brand: 'Oppo',
                image_url: '/uploads/products/dienthoai3.png',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },

            {
                name: 'iPhone 16e 128GB | Chính hãng VN/A',
                slug: 'iphone-16e-128gb-chinh-hang-vn-a',
                description:
                    'Điện thoại iPhone 16e với màn hình 6.7" Super Retina XDR, chip A17 Bionic, RAM 8GB, bộ nhớ trong 128GB. Camera Pro với nhiều tính năng chụp ảnh chuyên nghiệp, pin lâu dài, thiết kế sang trọng.',
                price: 30590000,
                stock_quantity: 15,
                category_id: 2,
                brand: 'Apple',
                image_url: '/uploads/products/dienthoai4.png',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },

            // tablet

            {
                name: 'iPad A16 Wifi 128GB 2025 | Chính hãng Apple Việt Nam',
                slug: 'ipad-a16-wifi-128gb-2025-chinh-hang-apple-viet-nam',
                description:
                    'iPad A16 nổi bật với chip A16 mạnh mẽ, màn hình Liquid Retina 11 inch sắc nét, cùng thiết kế mỏng nhẹ mang đến phong cách hiện đại cho người dùng. Thiết bị còn trang bị khả năng kết nối tốt với Apple Pencil và bàn phím Magic Keyboard Folio. Thiết bị có pin bền, sạc tốc độ cao USB-C, mang lại trải nghiệm liền mạch.',
                price: 8429300,
                stock_quantity: 15,
                category_id: 3,
                brand: 'Apple',
                image_url: '/uploads/products/tablet.png',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },

            {
                name: 'iPad Pro M4 11 inch Wifi 256GB | Chính hãng Apple Việt Nam',
                slug: 'ipad-pro-m4-11-inch-wifi-256gb-chinh-hang-apple-viet-nam',
                description:
                    'iPad Pro M4 nổi bật với chip M4 mạnh mẽ, màn hình Liquid Retina 11 inch sắc nét, cùng thiết kế mỏng nhẹ mang đến phong cách hiện đại cho người dùng. Thiết bị còn trang bị khả năng kết nối tốt với Apple Pencil và bàn phím Magic Keyboard Folio. Thiết bị có pin bền, sạc tốc độ cao USB-C, mang lại trải nghiệm liền mạch.',
                price: 22990000,
                stock_quantity: 15,
                category_id: 3,
                brand: 'Apple',
                image_url: '/uploads/products/tablet1.png',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Máy tính bảng Huawei MatePad Pro 12.2 2025 12GB 512GB kèm bàn phím',
                slug: 'huawei-matepad-pro-12-2-2025-12gb-512gb-kem-ban-phim',
                description:
                    'Máy tính bảng Huawei MatePad Pro 12.2 inch với RAM 12GB, bộ nhớ trong 512GB, kèm bàn phím tiện lợi. Thiết kế hiện đại, hiệu năng mạnh mẽ, phù hợp cho công việc và giải trí.',
                price: 22990000,
                stock_quantity: 15,
                category_id: 3,
                brand: 'Huawei',
                image_url: '/uploads/products/tablet2.png',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },

            // phụ kiện
            {
                name: 'Tai nghe Bluetooth Apple AirPods 4 | Chính hãng Apple Việt Nam',
                slug: 'tai-nghe-bluetooth-apple-airpods-4-chinh-hang-apple-viet-nam',
                description:
                    'Tai nghe Bluetooth Apple AirPods 4 với chất lượng âm thanh tuyệt vời, thiết kế tiện lợi và khả năng kết nối nhanh chóng. Phù hợp cho người dùng yêu thích công nghệ và âm nhạc.',
                price: 3090000,
                stock_quantity: 25,
                category_id: 4,
                brand: 'Apple',
                image_url: '/uploads/products/tainghe.png',
                is_active: true,
                discount_percentage: 15,
                created_at: new Date(),
                updated_at: new Date()
            },

            {
                name: 'Tai nghe Bluetooth Apple AirPods Pro 3 2025 Type-C | Chính hãng (MFHP4ZP/A)',
                slug: 'tai-nghe-bluetooth-apple-airpods-pro-3-2025-type-c-chinh-hang-mfhp4zp-a',
                description:
                    'Tai nghe Bluetooth Apple AirPods Pro 3 với chất lượng âm thanh tuyệt vời, thiết kế tiện lợi và khả năng kết nối nhanh chóng. Phù hợp cho người dùng yêu thích công nghệ và âm nhạc.',
                price: 6690000,
                stock_quantity: 25,
                category_id: 4,
                brand: 'Apple',
                image_url: '/uploads/products/tainghe1.png',
                is_active: true,
                discount_percentage: 15,
                created_at: new Date(),
                updated_at: new Date()
            },

            {
                name: 'Sạc nhanh Apple 20w USB-C chính hãng Apple Việt Nam',
                slug: 'sac-nhanh-apple-20w-usb-c-chinh-hang-apple-viet-nam',
                description:
                    'Sạc nhanh Apple 20w USB-C với thiết kế nhỏ gọn, hiệu suất sạc cao và an toàn cho thiết bị. Phù hợp cho người dùng cần sạc nhanh và tiện lợi.',
                price: 490000,
                stock_quantity: 25,
                category_id: 4,
                brand: 'Apple',
                image_url: '/uploads/products/sac.png',
                is_active: true,
                discount_percentage: 15,
                created_at: new Date(),
                updated_at: new Date()
            },


            // Linh kiện PC

            {
                name: 'Laptop Lenovo ThinkPad X1',
                slug: 'laptop-lenovo-thinkpad-x1',
                description:
                    'Laptop Lenovo ThinkPad X1 Carbon với màn hình 14" FHD, Intel Core i7-1165G7, RAM 16GB, SSD 512GB. Dòng laptop doanh nghiệp cao cấp, bền bỉ và chuyên nghiệp.',
                price: 32990000,
                stock_quantity: 10,
                category_id: 1,
                brand: 'Lenovo',
                image_url: '/uploads/products/image copy 3.png',
                is_active: true,
                discount_percentage: 5,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'PC Gaming Custom RTX 4070',
                slug: 'pc-gaming-custom-rtx-4070',
                description:
                    'PC Gaming Custom Build với Intel Core i7-13700K, RTX 4070 12GB, RAM 32GB DDR5, SSD 1TB NVMe. Hiệu năng khủng, chiến mọi tựa game ở mức cao nhất.',
                price: 45990000,
                stock_quantity: 8,
                category_id: 2,
                brand: 'Custom Build',
                image_url: '/uploads/products/image copy 5.png',
                is_active: true,
                discount_percentage: 8,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Màn hình LG UltraGear 27"',
                slug: 'man-hinh-lg-ultragear-27',
                description:
                    'Màn hình Gaming LG UltraGear 27" 4K UHD, tần số quét 144Hz, thời gian phản hồi 1ms, HDR400, tấm nền IPS. Trải nghiệm gaming tuyệt vời với màu sắc sống động.',
                price: 12990000,
                stock_quantity: 20,
                category_id: 3,
                brand: 'LG',
                image_url: '/uploads/products/image copy 7.png',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },

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
