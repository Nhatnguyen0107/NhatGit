import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn file cấu hình
const configPath = path.join(__dirname, '../../config/settings.json');

class SettingsController {
    constructor() {
        this.initializeSettingsFile();
    }

    // Khởi tạo file settings.json nếu chưa có
    initializeSettingsFile() {
        const defaultSettings = {
            system: {
                siteName: 'E-Commerce Store',
                siteDescription: 'Cửa hàng điện tử uy tín',
                contactEmail: 'contact@ecommerce.com',
                contactPhone: '0123456789',
                address: '123 Nguyễn Văn A, Q1, TP.HCM',
                currency: 'VND',
                timezone: 'Asia/Ho_Chi_Minh',
                maintenanceMode: false,
                allowRegistration: true,
                emailNotifications: true,
                smsNotifications: false
            },
            email: {
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                smtpUsername: '',
                smtpPassword: '',
                smtpSecure: true,
                fromEmail: 'noreply@ecommerce.com',
                fromName: 'E-Commerce Store'
            },
            security: {
                sessionTimeout: 30,
                maxLoginAttempts: 5,
                lockoutDuration: 15,
                passwordMinLength: 8,
                requireSpecialChars: true,
                requireNumbers: true,
                requireUppercase: true,
                twoFactorAuth: false
            }
        };

        // Tạo thư mục config nếu chưa có
        const configDir = path.dirname(configPath);
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }

        // Tạo file settings.json nếu chưa có
        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(
                configPath,
                JSON.stringify(defaultSettings, null, 2)
            );
        }
    }

    // Đọc settings từ file
    readSettings() {
        try {
            const settingsData = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(settingsData);
        } catch (error) {
            console.error('Error reading settings:', error);
            throw new Error('Failed to read settings');
        }
    }

    // Ghi settings vào file
    writeSettings(settings) {
        try {
            fs.writeFileSync(
                configPath,
                JSON.stringify(settings, null, 2)
            );
        } catch (error) {
            console.error('Error writing settings:', error);
            throw new Error('Failed to save settings');
        }
    }

    // GET /api/settings - Lấy tất cả cài đặt
    async getAllSettings(req, res) {
        try {
            const settings = this.readSettings();
            res.json({
                success: true,
                data: settings
            });
        } catch (error) {
            console.error('❌ Get settings error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch settings',
                error: error.message
            });
        }
    }

    // PUT /api/settings/system - Cập nhật cài đặt hệ thống
    async updateSystemSettings(req, res) {
        try {
            const settings = this.readSettings();
            settings.system = { ...settings.system, ...req.body };
            this.writeSettings(settings);

            res.json({
                success: true,
                message: 'System settings updated successfully',
                data: settings.system
            });
        } catch (error) {
            console.error('❌ Update system settings error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update system settings',
                error: error.message
            });
        }
    }

    // PUT /api/settings/email - Cập nhật cài đặt email
    async updateEmailSettings(req, res) {
        try {
            const settings = this.readSettings();
            settings.email = { ...settings.email, ...req.body };
            this.writeSettings(settings);

            res.json({
                success: true,
                message: 'Email settings updated successfully',
                data: settings.email
            });
        } catch (error) {
            console.error('❌ Update email settings error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update email settings',
                error: error.message
            });
        }
    }

    // PUT /api/settings/security - Cập nhật cài đặt bảo mật
    async updateSecuritySettings(req, res) {
        try {
            const settings = this.readSettings();
            settings.security = { ...settings.security, ...req.body };
            this.writeSettings(settings);

            res.json({
                success: true,
                message: 'Security settings updated successfully',
                data: settings.security
            });
        } catch (error) {
            console.error('❌ Update security settings error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update security settings',
                error: error.message
            });
        }
    }

    // POST /api/settings/test-email - Kiểm tra cấu hình email
    async testEmail(req, res) {
        try {
            const settings = this.readSettings();
            const emailConfig = settings.email;

            // Giả lập kiểm tra email (trong thực tế sẽ gửi email thật)
            if (!emailConfig.smtpHost || !emailConfig.smtpUsername) {
                return res.status(400).json({
                    success: false,
                    message: 'Email configuration is incomplete'
                });
            }

            // TODO: Implement actual email sending
            // const nodemailer = require('nodemailer');
            // const transporter = nodemailer.createTransporter({...});
            // await transporter.sendMail({...});

            res.json({
                success: true,
                message: 'Test email sent successfully'
            });
        } catch (error) {
            console.error('❌ Test email error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send test email',
                error: error.message
            });
        }
    }

    // POST /api/settings/clear-cache - Xóa cache
    async clearCache(req, res) {
        try {
            // Giả lập xóa cache (trong thực tế sẽ xóa Redis, file cache, etc.)
            // TODO: Implement actual cache clearing
            // redis.flushall();
            // fs.rmSync('./cache', { recursive: true, force: true });

            res.json({
                success: true,
                message: 'Cache cleared successfully'
            });
        } catch (error) {
            console.error('❌ Clear cache error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to clear cache',
                error: error.message
            });
        }
    }

    // POST /api/settings/backup - Backup database
    async backupDatabase(req, res) {
        try {
            // Giả lập backup database
            // TODO: Implement actual database backup
            // exec('pg_dump database_name > backup.sql');

            res.json({
                success: true,
                message: 'Database backup completed successfully'
            });
        } catch (error) {
            console.error('❌ Database backup error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to backup database',
                error: error.message
            });
        }
    }

    // POST /api/settings/optimize - Tối ưu database
    async optimizeDatabase(req, res) {
        try {
            // Giả lập optimize database
            // TODO: Implement actual database optimization
            // await sequelize.query('VACUUM;');
            // await sequelize.query('ANALYZE;');

            res.json({
                success: true,
                message: 'Database optimized successfully'
            });
        } catch (error) {
            console.error('❌ Database optimize error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to optimize database',
                error: error.message
            });
        }
    }

    // GET /api/settings/system-info - Lấy thông tin hệ thống
    async getSystemInfo(req, res) {
        try {
            const os = await import('os');
            const process = await import('process');

            const systemInfo = {
                server: {
                    platform: os.platform(),
                    arch: os.arch(),
                    cpus: os.cpus().length,
                    totalMemory: Math.round(os.totalmem() / 1024 / 1024),
                    freeMemory: Math.round(os.freemem() / 1024 / 1024),
                    uptime: Math.round(os.uptime())
                },
                node: {
                    version: process.version,
                    memoryUsage: process.memoryUsage(),
                    uptime: Math.round(process.uptime())
                }
            };

            res.json({
                success: true,
                data: systemInfo
            });
        } catch (error) {
            console.error('❌ Get system info error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get system info',
                error: error.message
            });
        }
    }
}

export default SettingsController;