import { DataTypes } from 'sequelize';
import sequelize from '../config/index.js';

const Review = sequelize.define('Review', {
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
        }
    },
    customer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'customers',
            key: 'id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        },
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
    }
}, {
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Review;
