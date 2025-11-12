export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('customers', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            first_name: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            last_name: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: true
            },
            billing_address: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            billing_city: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            billing_country: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            billing_postal_code: {
                type: Sequelize.STRING(20),
                allowNull: true
            },
            shipping_address: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            shipping_city: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            shipping_country: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            shipping_postal_code: {
                type: Sequelize.STRING(20),
                allowNull: true
            },
            discount_percentage: {
                type: Sequelize.DECIMAL(5, 2),
                defaultValue: 0
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                    'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
                )
            }
        });

        // Add indexes
        await queryInterface.addIndex('customers', ['user_id']);
        await queryInterface.addIndex('customers', ['phone']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('customers');
    }
};
