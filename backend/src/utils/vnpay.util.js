import crypto from 'crypto';
import querystring from 'querystring';

export class VNPayUtil {
    constructor() {
        this.vnpUrl = process.env.VNP_URL;
        this.tmnCode = process.env.VNP_TMNCODE;
        this.hashSecret = process.env.VNP_HASHSECRET;
        this.returnUrl = process.env.VNP_RETURNURL;
    }

    createPaymentUrl(params) {
        const vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.tmnCode,
            vnp_Amount: params.amount * 100,
            vnp_CreateDate: this.formatDate(new Date()),
            vnp_CurrCode: 'VND',
            vnp_IpAddr: params.ipAddr,
            vnp_Locale: params.locale || 'vn',
            vnp_OrderInfo: params.orderInfo,
            vnp_OrderType: params.orderType || 'other',
            vnp_ReturnUrl: this.returnUrl,
            vnp_TxnRef: params.txnRef
        };

        // Sort and create query string
        const sortedParams = this.sortObject(vnpParams);
        const queryString = querystring.stringify(sortedParams);

        // Create secure hash
        const secureHash = crypto
            .createHmac('sha512', this.hashSecret)
            .update(queryString)
            .digest('hex');

        sortedParams.vnp_SecureHash = secureHash;

        return this.vnpUrl + '?' + querystring.stringify(sortedParams);
    }

    verifyReturnUrl(params) {
        const secureHash = params.vnp_SecureHash;
        delete params.vnp_SecureHash;
        delete params.vnp_SecureHashType;

        const sortedParams = this.sortObject(params);
        const queryString = querystring.stringify(sortedParams);

        const calculatedHash = crypto
            .createHmac('sha512', this.hashSecret)
            .update(queryString)
            .digest('hex');

        return secureHash === calculatedHash;
    }

    sortObject(obj) {
        const sorted = {};
        const str = [];
        let key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }

        str.sort();

        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
        }

        return sorted;
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }
}