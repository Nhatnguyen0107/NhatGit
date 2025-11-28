export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('categories', [
            {
                id: 1,
                name: 'Laptops',
                slug: 'laptops',
                description: 'Portable computers for work and entertainment',
                image_url: 'https://via.placeholder.com/300x200?text=Laptops',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 2,
                name: 'Desktop PCs',
                slug: 'desktop-pcs',
                description: 'High-performance desktop computers',
                image_url: 'https://via.placeholder.com/300x200?text=Desktops',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 3,
                name: 'Monitors',
                slug: 'monitors',
                description: 'LED, LCD and Gaming monitors',
                image_url: 'https://via.placeholder.com/300x200?text=Monitors',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 4,
                name: 'Keyboards & Mice',
                slug: 'keyboards-mice',
                description: 'Mechanical keyboards and gaming mice',
                image_url:
                    'https://via.placeholder.com/300x200?text=Keyboards',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 5,
                name: 'Storage Devices',
                slug: 'storage-devices',
                description: 'SSDs, HDDs, and external storage',
                image_url: 'https://via.placeholder.com/300x200?text=Storage',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 6,
                name: 'Networking',
                slug: 'networking',
                description: 'Routers, switches, and network adapters',
                image_url:
                    'https://via.placeholder.com/300x200?text=Networking',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 7,
                name: 'Accessories',
                slug: 'accessories',
                description: 'Cables, adapters, and other accessories',
                image_url:
                    'https://via.placeholder.com/300x200?text=Accessories',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('categories', null, {});
    }
};
