export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('order_items', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            order_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            product_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            product_name: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            product_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            discount_percentage: {
                type: Sequelize.DECIMAL(5, 2),
                defaultValue: 0
            },
            subtotal: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
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
        await queryInterface.addIndex('order_items', ['order_id']);
        await queryInterface.addIndex('order_items', ['product_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('order_items');
    }
};
