import sequelize from './config/index.js';

const checkTables = async () => {
    try {
        const [results] = await sequelize.query('SHOW TABLES');

        console.log('\n✅ Database tables:');
        console.log('==================');
        results.forEach((row, index) => {
            const tableName = Object.values(row)[0];
            console.log(`${index + 1}. ${tableName}`);
        });
        console.log('==================\n');

        // Get table structure for one table as example
        const [structure] = await sequelize.query(
            'DESCRIBE users'
        );

        console.log('📋 Example: Users table structure:');
        console.table(structure);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkTables();
