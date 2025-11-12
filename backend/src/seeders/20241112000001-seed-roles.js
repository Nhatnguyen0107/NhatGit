export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('roles', [
            {
                id: 1,
                name: 'Admin',
                description: 'Full system access - manage all resources',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 2,
                name: 'Staff',
                description: 'Limited access - manage orders and customers',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 3,
                name: 'Customer',
                description: 'Customer access - browse and purchase products',
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('roles', null, {});
    }
};
