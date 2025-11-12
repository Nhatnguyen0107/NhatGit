import sequelize from './config/index.js';
import db from './models/index.js';

const syncDatabase = async () => {
    try {
        console.log('🔄 Syncing database...');

        // Sync all models in order (force: true drops existing tables)
        await sequelize.sync({ force: true });

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
