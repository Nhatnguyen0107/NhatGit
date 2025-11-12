import { DataTypes } from 'sequelize';
import sequelize from '../config/index.js';

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Foreign key to orders table'
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Foreign key to products table'
    },
    product_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Snapshot of product name at order time'
    },
    product_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        },
        comment: 'Snapshot of product price at order time'
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    discount_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        },
        comment: 'quantity * product_price * (1 - discount_percentage/100)'
    }
}, {
    tableName: 'order_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default OrderItem;
