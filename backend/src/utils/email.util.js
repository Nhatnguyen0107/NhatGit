import nodemailer from 'nodemailer';

class EmailUtil {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    /**
     * Gửi email thông báo thanh toán thành công
     */
    async sendPaymentSuccessEmail(orderData) {
        try {
            console.log('📧 Preparing to send email...');
            console.log('📧 Order data:', {
                order_number: orderData.order_number,
                customer_email: orderData.customer_email,
                items_count: orderData.items?.length
            });

            const { order_number, total_amount, customer_email, items } = orderData;

            const itemsHtml = items
                .map(
                    item => `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                        ${item.product_name}
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; 
                        text-align: center;">
                        ${item.quantity}
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; 
                        text-align: right;">
                        ${this.formatPrice(item.price)}đ
                    </td>
                </tr>
            `
                )
                .join('');

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: customer_email,
                subject: `✅ Thanh toán thành công - Đơn hàng ${order_number}`,
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <style>
                            body { font-family: Arial, sans-serif; }
                            .container { 
                                max-width: 600px; 
                                margin: 0 auto; 
                                padding: 20px; 
                            }
                            .header { 
                                background: linear-gradient(135deg, #667eea 0%, 
                                    #764ba2 100%); 
                                color: white; 
                                padding: 30px; 
                                text-align: center; 
                                border-radius: 10px 10px 0 0; 
                            }
                            .content { 
                                background: white; 
                                padding: 30px; 
                                border: 1px solid #e0e0e0; 
                            }
                            .success-icon { 
                                font-size: 48px; 
                                margin-bottom: 10px; 
                            }
                            .order-info { 
                                background: #f8f9fa; 
                                padding: 20px; 
                                border-radius: 8px; 
                                margin: 20px 0; 
                            }
                            table { 
                                width: 100%; 
                                border-collapse: collapse; 
                            }
                            .total { 
                                font-size: 20px; 
                                font-weight: bold; 
                                color: #e74c3c; 
                                text-align: right; 
                                padding-top: 15px; 
                                border-top: 2px solid #333; 
                            }
                            .footer { 
                                text-align: center; 
                                padding: 20px; 
                                color: #666; 
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <div class="success-icon">✅</div>
                                <h1>Thanh toán thành công!</h1>
                            </div>
                            
                            <div class="content">
                                <div class="order-info">
                                    <p><strong>Mã đơn hàng:</strong> 
                                        ${order_number}</p>
                                    <p><strong>Thời gian:</strong> 
                                        ${new Date().toLocaleString('vi-VN')}</p>
                                    <p><strong>Phương thức thanh toán:</strong> 
                                        PayOS</p>
                                </div>

                                <h3>Chi tiết đơn hàng:</h3>
                                <table>
                                    <thead>
                                        <tr style="background: #f0f0f0;">
                                            <th style="padding: 10px; text-align: left;">
                                                Sản phẩm
                                            </th>
                                            <th style="padding: 10px; text-align: center;">
                                                SL
                                            </th>
                                            <th style="padding: 10px; text-align: right;">
                                                Giá
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${itemsHtml}
                                    </tbody>
                                </table>

                                <div class="total">
                                    Tổng cộng: ${this.formatPrice(total_amount)}đ
                                </div>

                                <div style="margin-top: 30px; padding: 20px; 
                                    background: #e8f5e9; border-radius: 8px;">
                                    <p style="margin: 0; color: #2e7d32;">
                                        <strong>🎉 Đơn hàng của bạn đã được xác nhận!</strong>
                                    </p>
                                    <p style="margin: 10px 0 0 0; color: #666;">
                                        Chúng tôi sẽ xử lý và giao hàng trong thời gian sớm nhất.
                                    </p>
                                </div>
                            </div>

                            <div class="footer">
                                <p>Cảm ơn bạn đã mua hàng tại E-Commerce System!</p>
                                <p style="font-size: 12px; color: #999;">
                                    Email này được gửi tự động, vui lòng không trả lời.
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            };

            console.log('📧 Sending email to:', customer_email);
            console.log('📧 From:', process.env.EMAIL_USER);

            const result = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent successfully to: ${customer_email}`);
            console.log('📧 Email result:', result.messageId);
            return true;
        } catch (error) {
            console.error('❌ Send email error:', error);
            console.error('❌ Error details:', {
                code: error.code,
                response: error.response,
                command: error.command
            });
            throw error;
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price);
    }
}

export default EmailUtil;
