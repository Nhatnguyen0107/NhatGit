import db from '../models/index.js';

const { User, Customer } = db;

async function checkUserProfile() {
    try {
        console.log('🔍 Checking all users and their customer profiles...\n');

        const users = await User.findAll({
            include: [{
                model: Customer,
                as: 'customer',
                required: false
            }],
            attributes: ['id', 'username', 'email', 'role_id']
        });

        console.log(`📊 Total users: ${users.length}\n`);

        users.forEach(user => {
            const hasProfile = user.customer ? '✅' : '❌';
            console.log(`${hasProfile} User: ${user.username} (ID: ${user.id})`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role ID: ${user.role_id}`);
            if (user.customer) {
                console.log(`   Customer ID: ${user.customer.id}`);
                console.log(`   Name: ${user.customer.first_name} ${user.customer.last_name}`);
            } else {
                console.log(`   ⚠️  NO CUSTOMER PROFILE`);
            }
            console.log('');
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkUserProfile();
