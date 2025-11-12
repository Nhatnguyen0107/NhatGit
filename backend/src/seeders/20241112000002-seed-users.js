import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export default {
    async up(queryInterface, Sequelize) {
        const hashedPassword = await bcrypt.hash('123456', 10);

        await queryInterface.bulkInsert('users', [
            {
                id: uuidv4(),
                email: 'admin@ecommerce.com',
                password: hashedPassword,
                role_id: 1,
                is_active: true,
                last_login: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                email: 'staff@ecommerce.com',
                password: hashedPassword,
                role_id: 2,
                is_active: true,
                last_login: null,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                email: 'customer1@example.com',
                password: hashedPassword,
                role_id: 3,
                is_active: true,
                last_login: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                email: 'customer2@example.com',
                password: hashedPassword,
                role_id: 3,
                is_active: true,
                last_login: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                email: 'customer3@example.com',
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
