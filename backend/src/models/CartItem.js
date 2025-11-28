import { DataTypes } from 'sequelize';
import sequelize from '../config/index.js';

const CartItem = sequelize.define('CartItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Foreign key to users table'
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Foreign key to products table'
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Cart items expire after 1 hour'
    }
}, {
    tableName: 'cart_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'product_id']
        }
    ]
});

export default CartItem;
