import paypal from 'paypal-rest-sdk';

export class PayPalUtil {
    constructor() {
        paypal.configure({
            mode: process.env.PAYPAL_MODE || 'sandbox',
            client_id: process.env.PAYPAL_CLIENT_ID,
            client_secret: process.env.PAYPAL_SECRET
        });
    }

    createPayment(paymentData) {
        return new Promise((resolve, reject) => {
            paypal.payment.create(paymentData, (error, payment) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(payment);
                }
            });
        });
    }

    executePayment(paymentId, executeData) {
        return new Promise((resolve, reject) => {
            paypal.payment.execute(paymentId, executeData, (error, payment) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(payment);
                }
            });
        });
    }

    getPayment(paymentId) {
        return new Promise((resolve, reject) => {
            paypal.payment.get(paymentId, (error, payment) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(payment);
                }
            });
        });
    }

    formatAmount(amount, currency = 'USD') {
        return {
            total: amount.toString(),
            currency: currency
        };
    }

    formatItems(items) {
        return items.map(item => ({
            name: item.name,
            sku: item.id || item.sku,
            price: item.price.toString(),
            currency: item.currency || 'USD',
            quantity: item.quantity
        }));
    }
}