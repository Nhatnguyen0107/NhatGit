import db from '../models/index.js';

class PaymentRepository {
    constructor() {
        this.model = db.Payment;
    }

    async create(data) {
        return await this.model.create(data);
    }

    async findById(id) {
        return await this.model.findByPk(id);
    }

    async findByOrderId(orderId) {
        return await this.model.findOne({
            where: { order_id: orderId },
            order: [['created_at', 'DESC']]
        });
    }

    async updateByOrderId(orderId, data) {
        return await this.model.update(data, {
            where: { order_id: orderId }
        });
    }

    async findAll(options = {}) {
        return await this.model.findAndCountAll(options);
    }

    async update(payment, data) {
        return await payment.update(data);
    }

    async delete(payment) {
        return await payment.destroy();
    }
}

export default PaymentRepository;