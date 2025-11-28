import express from 'express';
import SettingsController from '../controllers/settings.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();
const controller = new SettingsController();

// Tất cả routes đều yêu cầu authentication và Admin role
router.use(authenticate);
router.use(authorize('Admin'));

// GET /api/settings - Lấy tất cả cài đặt
router.get('/', controller.getAllSettings.bind(controller));

// PUT /api/settings/system - Cập nhật cài đặt hệ thống
router.put('/system', controller.updateSystemSettings.bind(controller));

// PUT /api/settings/email - Cập nhật cài đặt email
router.put('/email', controller.updateEmailSettings.bind(controller));

// PUT /api/settings/security - Cập nhật cài đặt bảo mật
router.put('/security', controller.updateSecuritySettings.bind(controller));

// POST /api/settings/test-email - Kiểm tra cấu hình email
router.post('/test-email', controller.testEmail.bind(controller));

// POST /api/settings/clear-cache - Xóa cache
router.post('/clear-cache', controller.clearCache.bind(controller));

// POST /api/settings/backup - Backup database
router.post('/backup', controller.backupDatabase.bind(controller));

// POST /api/settings/optimize - Tối ưu database
router.post('/optimize', controller.optimizeDatabase.bind(controller));

// GET /api/settings/system-info - Lấy thông tin hệ thống
router.get('/system-info', controller.getSystemInfo.bind(controller));

export default router;