import db from '../models/index.js';

const { User, Customer, Role } = db;

/**
 * Script to create customer profiles for existing users
 * Run this once: node src/scripts/create-customer-profiles.js
 */
async function createCustomerProfiles() {
    try {
        console.log('🔄 Starting to create customer profiles...');

        // Find all users with Customer role that don't have a customer profile
        const users = await User.findAll({
            include: [
                {
                    model: Role,
                    as: 'role',
                    where: { name: 'Customer' }
                },
                {
                    model: Customer,
                    as: 'customer',
                    required: false
                }
            ]
        });

        console.log(`📊 Found ${users.length} customer users`);

        let created = 0;
        let skipped = 0;

        for (const user of users) {
            // Check if customer profile exists
            if (user.customer) {
                // Update if first_name or last_name is empty
                if (!user.customer.first_name || !user.customer.last_name) {
                    const nameToSplit = user.full_name || user.username;
                    const nameParts = nameToSplit.trim().split(' ');
                    const firstName = nameParts[0] || 'Customer';
                    const lastName = nameParts.slice(1).join(' ') || firstName;

                    await user.customer.update({
                        first_name: user.customer.first_name || firstName,
                        last_name: user.customer.last_name || lastName
                    });

                    console.log(`🔄 Updated profile for user: ${user.username}`);
                    created++;
                } else {
                    console.log(`⏭️  Skipping user ${user.username} - profile complete`);
                    skipped++;
                }
                continue;
            }

            // Split username or full_name for firstName/lastName
            const nameToSplit = user.full_name || user.username;
            const nameParts = nameToSplit.trim().split(' ');
            const firstName = nameParts[0] || 'Customer';
            const lastName = nameParts.slice(1).join(' ') || firstName;

            // Create customer profile
            await Customer.create({
                user_id: user.id,
                first_name: firstName,
                last_name: lastName,
                phone: user.phone || null
            });

            console.log(`✅ Created profile for user: ${user.username}`);
            created++;
        }

        console.log('\n📈 Summary:');
        console.log(`   ✅ Created: ${created}`);
        console.log(`   ⏭️  Skipped: ${skipped}`);
        console.log(`   📊 Total: ${users.length}`);
        console.log('\n✨ Done!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating customer profiles:', error);
        process.exit(1);
    }
}

// Run the script
createCustomerProfiles();
