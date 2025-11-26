import { v4 as uuidv4 } from 'uuid';

export default {
    async up(queryInterface, Sequelize) {
        // Get customer users first
        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users WHERE role_id = 3 ORDER BY created_at`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (users.length < 3) {
            throw new Error(
                'Not enough customer users found. Run user seeder first.'
            );
        }

        await queryInterface.bulkInsert('customers', [
            {
                id: uuidv4(),
                user_id: users[0].id,
                first_name: 'John',
                last_name: 'Doe',
                phone: '+1-555-0101',
                billing_address: '123 Main Street, Apt 4B',
                billing_city: 'New York',
                billing_country: 'USA',
                billing_postal_code: '10001',
                shipping_address: '123 Main Street, Apt 4B',
                shipping_city: 'New York',
                shipping_country: 'USA',
                shipping_postal_code: '10001',
                discount_percentage: 5.00,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                user_id: users[1].id,
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
                discount_percentage: 10.00,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                user_id: users[2].id,
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
                discount_percentage: 0.00,
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('customers', null, {});
    }
};
