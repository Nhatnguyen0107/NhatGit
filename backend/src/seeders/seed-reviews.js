import db from '../models/index.js';

const seedReviews = async () => {
    try {
        console.log('🌱 Seeding reviews...');

        // Get some products and customers
        const products = await db.Product.findAll({ limit: 5 });
        const customers = await db.Customer.findAll({ limit: 3 });

        if (products.length === 0 || customers.length === 0) {
            console.log('⚠️ No products or customers found. Please seed products and customers first.');
            return;
        }

        const sampleReviews = [
            {
                product_id: products[0].id,
                customer_id: customers[0].id,
                rating: 5,
                comment: 'Sản phẩm rất tuyệt vời! Chất lượng tốt, đúng như mô tả. Giao hàng nhanh chóng.',
                is_verified_purchase: true,
                is_visible: true,
                helpful_count: 15
            },
            {
                product_id: products[0].id,
                customer_id: customers[1].id,
                rating: 4,
                comment: 'Sản phẩm tốt, giá cả hợp lý. Đóng gói cẩn thận.',
                is_verified_purchase: true,
                is_visible: true,
                helpful_count: 8
            },
            {
                product_id: products[1].id,
                customer_id: customers[0].id,
                rating: 5,
                comment: 'Mình rất hài lòng với sản phẩm này. Sẽ ủng hộ shop tiếp!',
                is_verified_purchase: true,
                is_visible: true,
                helpful_count: 12
            },
            {
                product_id: products[1].id,
                customer_id: customers[2].id,
                rating: 3,
                comment: 'Sản phẩm bình thường, không có gì đặc biệt.',
                is_verified_purchase: false,
                is_visible: true,
                helpful_count: 3
            },
            {
                product_id: products[2].id,
                customer_id: customers[1].id,
                rating: 5,
                comment: 'Tuyệt vời! Đóng gói đẹp, giao hàng siêu nhanh. Recommend!',
                is_verified_purchase: true,
                is_visible: true,
                helpful_count: 20
            },
            {
                product_id: products[2].id,
                customer_id: customers[0].id,
                rating: 4,
                comment: 'Chất lượng tốt, giá hợp lý. Sẽ mua lại.',
                is_verified_purchase: true,
                is_visible: true,
                helpful_count: 7
            },
            {
                product_id: products[3].id,
                customer_id: customers[2].id,
                rating: 2,
                comment: 'Sản phẩm không như mong đợi. Chất lượng tạm ổn.',
                is_verified_purchase: true,
                is_visible: false, // Admin đã ẩn review này
                helpful_count: 1
            },
            {
                product_id: products[3].id,
                customer_id: customers[1].id,
                rating: 5,
                comment: 'Tuyệt vời! Mình đã mua 3 lần rồi, lần nào cũng hài lòng.',
                is_verified_purchase: true,
                is_visible: true,
                helpful_count: 18
            },
            {
                product_id: products[4].id,
                customer_id: customers[0].id,
                rating: 4,
                comment: 'Sản phẩm tốt trong tầm giá. Giao hàng đúng hẹn.',
                is_verified_purchase: true,
                is_visible: true,
                helpful_count: 10
            },
            {
                product_id: products[4].id,
                customer_id: customers[2].id,
                rating: 5,
                comment: 'Chất lượng xuất sắc! Đáng tiền. Highly recommended!',
                is_verified_purchase: true,
                is_visible: true,
                helpful_count: 25
            }
        ];

        for (const reviewData of sampleReviews) {
            await db.Review.create(reviewData);
        }

        console.log(`✅ Seeded ${sampleReviews.length} reviews successfully!`);
    } catch (error) {
        console.error('❌ Error seeding reviews:', error);
        throw error;
    }
};

// Run seeder
seedReviews()
    .then(() => {
        console.log('✅ Review seeding completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Review seeding failed:', error);
        process.exit(1);
    });
