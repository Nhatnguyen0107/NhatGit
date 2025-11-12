import db from './models/index.js';

const {
    Role, User, Category, Product, Customer, Order, OrderItem
} = db;

const checkData = async () => {
    try {
        console.log('\n📊 Database Statistics\n');
        console.log('='.repeat(50));

        // Count records
        const roleCount = await Role.count();
        const userCount = await User.count();
        const categoryCount = await Category.count();
        const productCount = await Product.count();
        const customerCount = await Customer.count();
        const orderCount = await Order.count();
        const orderItemCount = await OrderItem.count();

        console.log(`📋 Roles:         ${roleCount}`);
        console.log(`👤 Users:         ${userCount}`);
        console.log(`📁 Categories:    ${categoryCount}`);
        console.log(`🛍️  Products:      ${productCount}`);
        console.log(`👥 Customers:     ${customerCount}`);
        console.log(`📦 Orders:        ${orderCount}`);
        console.log(`📄 Order Items:   ${orderItemCount}`);
        console.log('='.repeat(50));

        // Show sample data
        console.log('\n📋 Roles:');
        const roles = await Role.findAll({
            attributes: ['id', 'name', 'description']
        });
        console.table(
            roles.map(r => r.toJSON())
        );

        console.log('\n👤 Users (sample):');
        const users = await User.findAll({
            attributes: ['email', 'is_active'],
            include: [{
                model: Role,
                as: 'role',
                attributes: ['name']
            }],
            limit: 5
        });
        console.table(
            users.map(u => ({
                email: u.email,
                role: u.role.name,
                active: u.is_active
            }))
        );

        console.log('\n📁 Categories:');
        const categories = await Category.findAll({
            attributes: ['name', 'slug', 'is_active']
        });
        console.table(
            categories.map(c => c.toJSON())
        );

        console.log('\n🛍️  Products (Top 5):');
        const products = await Product.findAll({
            attributes: ['name', 'brand', 'price', 'stock_quantity'],
            include: [{
                model: Category,
                as: 'category',
                attributes: ['name']
            }],
            limit: 5
        });
        console.table(
            products.map(p => ({
                name: p.name,
                brand: p.brand,
                category: p.category.name,
                price: `$${p.price}`,
                stock: p.stock_quantity
            }))
        );

        console.log('\n📦 Orders:');
        const orders = await Order.findAll({
            attributes: [
                'order_number',
                'status',
                'total_amount',
                'payment_status'
            ],
            include: [
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['first_name', 'last_name']
                },
                {
                    model: OrderItem,
                    as: 'order_items',
                    attributes: ['id']
                }
            ]
        });
        console.table(
            orders.map(o => ({
                order_number: o.order_number,
                customer: `${o.customer.first_name} ${o.customer.last_name}`,
                status: o.status,
                payment: o.payment_status,
                total: `$${o.total_amount}`,
                items: o.order_items.length
            }))
        );

        console.log('\n✅ All data loaded successfully!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error checking data:', error);
        process.exit(1);
    }
};

checkData();
