import { DataTypes } from 'sequelize';

const PaymentModel = (sequelize) => {
    const Payment = sequelize.define('Payment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        order_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id'
            }
        },
        provider: {
            type: DataTypes.ENUM('vnpay', 'paypal'),
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending'
        },
        transaction_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        response_data: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        tableName: 'payments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['order_id']
            },
            {
                fields: ['transaction_id']
            },
            {
                fields: ['provider']
            }
        ]
    });

    return Payment;
};

export default PaymentModel;