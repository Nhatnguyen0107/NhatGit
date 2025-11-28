'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('payments', {
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
            provider: {
                type: Sequelize.ENUM('vnpay', 'paypal'),
                allowNull: false
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('pending', 'completed', 'failed', 'cancelled'),
                allowNull: false,
                defaultValue: 'pending'
            },
            transaction_id: {
                type: Sequelize.STRING,
                allowNull: true
            },
            response_data: {
                type: Sequelize.JSON,
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
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Add indexes
        await queryInterface.addIndex('payments', ['order_id']);
        await queryInterface.addIndex('payments', ['transaction_id']);
        await queryInterface.addIndex('payments', ['provider']);
        await queryInterface.addIndex('payments', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('payments');
    }
};