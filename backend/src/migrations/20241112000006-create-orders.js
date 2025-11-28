export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            order_number: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            customer_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'customers',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            status: {
                type: Sequelize.ENUM(
                    'pending',
                    'processing',
                    'shipped',
                    'delivered',
                    'cancelled'
                ),
                defaultValue: 'pending'
            },
            subtotal: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            discount_amount: {
                type: Sequelize.DECIMAL(10, 2),
                defaultValue: 0
            },
            shipping_cost: {
                type: Sequelize.DECIMAL(10, 2),
                defaultValue: 0
            },
            total_amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            payment_method: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            payment_status: {
                type: Sequelize.ENUM('pending', 'paid', 'failed', 'refunded'),
                defaultValue: 'pending'
            },
            shipping_address: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            shipped_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            delivered_at: {
                type: Sequelize.DATE,
                allowNull: true
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
        await queryInterface.addIndex('orders', ['order_number']);
        await queryInterface.addIndex('orders', ['customer_id']);
        await queryInterface.addIndex('orders', ['status']);
        await queryInterface.addIndex('orders', ['created_at']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('orders');
    }
};
