import { v4 as uuidv4 } from 'uuid';

export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('products', [
            // Laptops (Category 1)
            {
                id: uuidv4(),
                name: 'Dell XPS 13 9310',
                slug: 'dell-xps-13-9310',
                description:
                    '13.4" FHD+ Display, Intel i7-1185G7, 16GB RAM, 512GB SSD',
                price: 1299.99,
                stock_quantity: 25,
                category_id: 1,
                brand: 'Dell',
                image_url: '/uploads/products/image.png',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'MacBook Pro 14" M2',
                slug: 'macbook-pro-14-m2',
                description:
                    '14" Liquid Retina XDR, Apple M2 Pro, 16GB RAM, 512GB SSD',
                price: 1999.00,
                stock_quantity: 15,
                category_id: 1,
                brand: 'Apple',
                image_url: '/uploads/products/image copy.png',
                is_active: true,
                discount_percentage: 5,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'HP Pavilion 15',
                slug: 'hp-pavilion-15',
                description:
                    '15.6" FHD, AMD Ryzen 5 5500U, 8GB RAM, 256GB SSD',
                price: 649.99,
                stock_quantity: 40,
                category_id: 1,
                brand: 'HP',
                image_url: '/uploads/products/image copy 2.png',
                is_active: true,
                discount_percentage: 15,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'Lenovo ThinkPad X1 Carbon',
                slug: 'lenovo-thinkpad-x1-carbon',
                description:
                    '14" FHD, Intel i7-1165G7, 16GB RAM, 512GB SSD',
                price: 1449.00,
                stock_quantity: 20,
                category_id: 1,
                brand: 'Lenovo',
                image_url: '/uploads/products/image copy 3.png',
                is_active: true,
                discount_percentage: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'ASUS ROG Strix G15',
                slug: 'asus-rog-strix-g15',
                description:
                    '15.6" FHD 144Hz, AMD Ryzen 7, RTX 3060, 16GB, 1TB SSD',
                price: 1599.99,
                stock_quantity: 18,
                category_id: 1,
                brand: 'ASUS',
                image_url: '/uploads/products/image copy 4.png',
                is_active: true,
                discount_percentage: 12,
                created_at: new Date(),
                updated_at: new Date()
            },

            // Desktop PCs (Category 2)
            {
                id: uuidv4(),
                name: 'Custom Gaming PC - RTX 4070',
                slug: 'custom-gaming-pc-rtx-4070',
                description:
                    'Intel i7-13700K, RTX 4070, 32GB DDR5, 1TB NVMe SSD',
                price: 2199.00,
                stock_quantity: 12,
                category_id: 2,
                brand: 'Custom Build',
                image_url: '/uploads/products/image copy 5.png',
                is_active: true,
                discount_percentage: 8,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'Dell OptiPlex 7090',
                slug: 'dell-optiplex-7090',
                description:
                    'Intel i5-11500, 16GB RAM, 512GB SSD, Business Desktop',
                price: 899.99,
                stock_quantity: 30,
                category_id: 2,
                brand: 'Dell',
                image_url: '/uploads/products/image copy 6.png',
                is_active: true,
                discount_percentage: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'HP Elite Desktop',
                slug: 'hp-elite-desktop',
                description:
                    'Intel i7-11700, 32GB RAM, 1TB SSD, Professional Workstation',
                price: 1399.00,
                stock_quantity: 15,
                category_id: 2,
                brand: 'HP',
                image_url: '/uploads/products/image copy 7.png',
                is_active: true,
                discount_percentage: 5,
                created_at: new Date(),
                updated_at: new Date()
            },

            // Monitors (Category 3)
            {
                id: uuidv4(),
                name: 'LG UltraGear 27" 4K',
                slug: 'lg-ultragear-27-4k',
                description:
                    '27" 4K UHD, 144Hz, 1ms, HDR400, IPS Gaming Monitor',
                price: 599.99,
                stock_quantity: 35,
                category_id: 3,
                brand: 'LG',
                image_url: '/uploads/products/image copy 8.png',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'Samsung Odyssey G7 32"',
                slug: 'samsung-odyssey-g7-32',
                description:
                    '32" QHD, 240Hz, 1ms, Curved Gaming Monitor',
                price: 749.00,
                stock_quantity: 22,
                category_id: 3,
                brand: 'Samsung',
                image_url: '/uploads/products/image copy 9.png',
                is_active: true,
                discount_percentage: 15,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'Dell UltraSharp U2723DE',
                slug: 'dell-ultrasharp-u2723de',
                description:
                    '27" QHD IPS, USB-C Hub, Professional Monitor',
                price: 549.99,
                stock_quantity: 28,
                category_id: 3,
                brand: 'Dell',
                image_url:
                    'https://via.placeholder.com/400x300?text=UltraSharp',
                is_active: true,
                discount_percentage: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'ASUS ProArt Display PA278QV',
                slug: 'asus-proart-pa278qv',
                description:
                    '27" WQHD IPS, 100% sRGB, Professional Monitor',
                price: 399.00,
                stock_quantity: 40,
                category_id: 3,
                brand: 'ASUS',
                image_url:
                    'https://via.placeholder.com/400x300?text=ProArt',
                is_active: true,
                discount_percentage: 8,
                created_at: new Date(),
                updated_at: new Date()
            },

            // Keyboards & Mice (Category 4)
            {
                id: uuidv4(),
                name: 'Logitech MX Keys',
                slug: 'logitech-mx-keys',
                description:
                    'Wireless Illuminated Keyboard, Multi-device',
                price: 99.99,
                stock_quantity: 60,
                category_id: 4,
                brand: 'Logitech',
                image_url:
                    'https://via.placeholder.com/400x300?text=MX+Keys',
                is_active: true,
                discount_percentage: 12,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'Razer BlackWidow V3',
                slug: 'razer-blackwidow-v3',
                description:
                    'Mechanical Gaming Keyboard, Green Switches, RGB',
                price: 139.99,
                stock_quantity: 45,
                category_id: 4,
                brand: 'Razer',
                image_url:
                    'https://via.placeholder.com/400x300?text=BlackWidow',
                is_active: true,
                discount_percentage: 20,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'Logitech G502 HERO',
                slug: 'logitech-g502-hero',
                description:
                    'High Performance Gaming Mouse, 25K DPI',
                price: 49.99,
                stock_quantity: 80,
                category_id: 4,
                brand: 'Logitech',
                image_url:
                    'https://via.placeholder.com/400x300?text=G502+HERO',
                is_active: true,
                discount_percentage: 15,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'Corsair K95 RGB Platinum',
                slug: 'corsair-k95-rgb-platinum',
                description:
                    'Mechanical Gaming Keyboard, Cherry MX Speed',
                price: 199.99,
                stock_quantity: 25,
                category_id: 4,
                brand: 'Corsair',
                image_url:
                    'https://via.placeholder.com/400x300?text=K95+RGB',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },

            // Storage Devices (Category 5)
            {
                id: uuidv4(),
                name: 'Samsung 980 PRO 1TB',
                slug: 'samsung-980-pro-1tb',
                description:
                    'NVMe M.2 SSD, 7000MB/s Read, PCIe 4.0',
                price: 129.99,
                stock_quantity: 55,
                category_id: 5,
                brand: 'Samsung',
                image_url:
                    'https://via.placeholder.com/400x300?text=980+PRO',
                is_active: true,
                discount_percentage: 18,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'WD Black SN850X 2TB',
                slug: 'wd-black-sn850x-2tb',
                description:
                    'NVMe SSD, 7300MB/s Read, Gaming Storage',
                price: 249.00,
                stock_quantity: 32,
                category_id: 5,
                brand: 'Western Digital',
                image_url:
                    'https://via.placeholder.com/400x300?text=WD+Black',
                is_active: true,
                discount_percentage: 12,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'Seagate Barracuda 4TB HDD',
                slug: 'seagate-barracuda-4tb-hdd',
                description:
                    '3.5" Internal Hard Drive, 5400RPM, 256MB Cache',
                price: 89.99,
                stock_quantity: 70,
                category_id: 5,
                brand: 'Seagate',
                image_url:
                    'https://via.placeholder.com/400x300?text=Barracuda',
                is_active: true,
                discount_percentage: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'SanDisk Extreme Portable SSD 1TB',
                slug: 'sandisk-extreme-portable-ssd-1tb',
                description:
                    'External SSD, 1050MB/s, USB-C, Rugged',
                price: 139.99,
                stock_quantity: 48,
                category_id: 5,
                brand: 'SanDisk',
                image_url:
                    'https://via.placeholder.com/400x300?text=Extreme+SSD',
                is_active: true,
                discount_percentage: 15,
                created_at: new Date(),
                updated_at: new Date()
            },

            // Networking (Category 6)
            {
                id: uuidv4(),
                name: 'TP-Link Archer AX6000',
                slug: 'tp-link-archer-ax6000',
                description:
                    'WiFi 6 Router, 8 Streams, 6Gbps, MU-MIMO',
                price: 279.99,
                stock_quantity: 20,
                category_id: 6,
                brand: 'TP-Link',
                image_url:
                    'https://via.placeholder.com/400x300?text=Archer+AX6000',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'ASUS RT-AX88U',
                slug: 'asus-rt-ax88u',
                description:
                    'WiFi 6 Gaming Router, AiMesh, 8 Ports',
                price: 349.00,
                stock_quantity: 15,
                category_id: 6,
                brand: 'ASUS',
                image_url:
                    'https://via.placeholder.com/400x300?text=RT-AX88U',
                is_active: true,
                discount_percentage: 8,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'Netgear Nighthawk Pro Gaming XR500',
                slug: 'netgear-nighthawk-xr500',
                description:
                    'Gaming Router, DumaOS, Geo-Filter',
                price: 299.99,
                stock_quantity: 18,
                category_id: 6,
                brand: 'Netgear',
                image_url:
                    'https://via.placeholder.com/400x300?text=Nighthawk',
                is_active: true,
                discount_percentage: 12,
                created_at: new Date(),
                updated_at: new Date()
            },

            // Accessories (Category 7)
            {
                id: uuidv4(),
                name: 'Cable Matters USB-C Hub',
                slug: 'cable-matters-usb-c-hub',
                description:
                    '7-in-1 Multiport Adapter, HDMI, USB 3.0, SD Card',
                price: 39.99,
                stock_quantity: 100,
                category_id: 7,
                brand: 'Cable Matters',
                image_url:
                    'https://via.placeholder.com/400x300?text=USB-C+Hub',
                is_active: true,
                discount_percentage: 20,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'Anker PowerPort III 65W',
                slug: 'anker-powerport-iii-65w',
                description:
                    'USB-C Charger, GaN Technology, Foldable',
                price: 45.99,
                stock_quantity: 85,
                category_id: 7,
                brand: 'Anker',
                image_url:
                    'https://via.placeholder.com/400x300?text=PowerPort',
                is_active: true,
                discount_percentage: 15,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'Amazon Basics HDMI Cable 6ft',
                slug: 'amazon-basics-hdmi-cable-6ft',
                description:
                    'High-Speed HDMI 2.0, 4K@60Hz, Ethernet',
                price: 8.99,
                stock_quantity: 200,
                category_id: 7,
                brand: 'Amazon Basics',
                image_url:
                    'https://via.placeholder.com/400x300?text=HDMI+Cable',
                is_active: true,
                discount_percentage: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'Belkin Surge Protector 12-Outlet',
                slug: 'belkin-surge-protector-12-outlet',
                description:
                    'Power Strip, 8ft Cord, 4320 Joules',
                price: 34.99,
                stock_quantity: 65,
                category_id: 7,
                brand: 'Belkin',
                image_url:
                    'https://via.placeholder.com/400x300?text=Surge+Protector',
                is_active: true,
                discount_percentage: 10,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'Microsoft Wireless Display Adapter',
                slug: 'microsoft-wireless-display-adapter',
                description:
                    'Miracast, Screen Mirroring, HDMI',
                price: 49.99,
                stock_quantity: 40,
                category_id: 7,
                brand: 'Microsoft',
                image_url:
                    'https://via.placeholder.com/400x300?text=Display+Adapter',
                is_active: true,
                discount_percentage: 5,
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('products', null, {});
    }
};
