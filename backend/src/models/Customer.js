import { DataTypes } from 'sequelize';
import sequelize from '../config/index.js';

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        comment: 'Foreign key to users table'
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    billing_address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    billing_city: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    billing_country: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    billing_postal_code: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    shipping_address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    shipping_city: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    shipping_country: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    shipping_postal_code: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    discount_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    }
}, {
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Customer;
