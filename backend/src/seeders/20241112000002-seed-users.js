import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export default {
    async up(queryInterface, Sequelize) {
        const hashedPassword = await bcrypt.hash('123456', 10);

        await queryInterface.bulkInsert('users', [
            {
                id: uuidv4(),
                username: 'Admin',
                email: 'admin@ecommerce.com',
                phone: '0900000001',
                password: hashedPassword,
                role_id: 1,
                is_active: true,
                last_login: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'Staff User',
                email: 'staff@ecommerce.com',
                phone: '0900000002',
                password: hashedPassword,
                role_id: 2,
                is_active: true,
                last_login: null,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'Customer One',
                email: 'customer1@example.com',
                phone: '0900000003',
                password: hashedPassword,
                role_id: 3,
                is_active: true,
                last_login: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'Customer Two',
                email: 'customer2@example.com',
                phone: '0900000004',
                password: hashedPassword,
                role_id: 3,
                is_active: true,
                last_login: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'Customer Three',
                email: 'customer3@example.com',
                phone: '0900000005',
                password: hashedPassword,
                role_id: 3,
                is_active: true,
                last_login: null,
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
    }
};
