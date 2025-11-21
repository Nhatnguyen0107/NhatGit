import { DataTypes } from 'sequelize';

export default {
    up: async (queryInterface) => {
        await queryInterface.createTable('reviews', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            product_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            customer_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'customers',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: 'Rating from 1 to 5 stars'
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            is_verified_purchase: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                comment: 'Whether this review is from verified purchase'
            },
            is_visible: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                comment: 'Whether this review is visible to public'
            },
            helpful_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'Number of users found this review helpful'
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        });

        // Add indexes
        await queryInterface.addIndex('reviews', ['product_id']);
        await queryInterface.addIndex('reviews', ['customer_id']);
        await queryInterface.addIndex('reviews', ['rating']);
        await queryInterface.addIndex('reviews', ['is_visible']);
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('reviews');
    }
};
