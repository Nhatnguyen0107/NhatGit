import db from '../models/index.js';

const addAvatarColumn = async () => {
    try {
        console.log('🔄 Adding avatar column to users table...');

        // Add avatar column to users table
        await db.sequelize.query(`
            ALTER TABLE users 
            ADD COLUMN avatar VARCHAR(500) NULL 
            COMMENT 'URL to user avatar image'
        `);

        console.log('✅ Avatar column added successfully!');
        process.exit(0);
    } catch (error) {
        if (error.message.includes('Duplicate column name')) {
            console.log('ℹ️ Avatar column already exists');
            process.exit(0);
        }
        console.error('❌ Error adding avatar column:', error.message);
        process.exit(1);
    }
};

addAvatarColumn();
