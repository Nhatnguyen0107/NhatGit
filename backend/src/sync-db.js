import db from './models/index.js';

const syncDatabase = async () => {
    try {
        console.log('🔄 Syncing database...');

        // Force sync - xóa và tạo lại tất cả bảng
        // Cẩn thận: Sẽ xóa toàn bộ dữ liệu!
        await db.sequelize.sync({ force: true });

        console.log('✅ All tables created successfully!');
        console.log('\n📋 Tables created:');
        console.log('  - roles');
        console.log('  - users');
        console.log('  - categories');
        console.log('  - products');
        console.log('  - customers');
        console.log('  - orders');
        console.log('  - order_items');
        console.log('  - cart_items');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error syncing database:', error);
        process.exit(1);
    }
};

syncDatabase();
