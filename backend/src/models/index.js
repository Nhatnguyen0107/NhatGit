import sequelize from '../config/index.js';
import Role from './Role.js';
import User from './User.js';
import Category from './Category.js';
import Product from './Product.js';
import Customer from './Customer.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import CartItem from './CartItem.js';
import Review from './Review.js';

// ============= Associations / Relationships =============

// Role - User: One to Many
Role.hasMany(User, {
    foreignKey: 'role_id',
    as: 'users'
});
User.belongsTo(Role, {
    foreignKey: 'role_id',
    as: 'role'
});

// User - Customer: One to One
User.hasOne(Customer, {
    foreignKey: 'user_id',
    as: 'customer'
});
Customer.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// Category - Product: One to Many
Category.hasMany(Product, {
    foreignKey: 'category_id',
    as: 'products'
});
Product.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category'
});

// Customer - Order: One to Many
Customer.hasMany(Order, {
    foreignKey: 'customer_id',
    as: 'orders'
});
Order.belongsTo(Customer, {
    foreignKey: 'customer_id',
    as: 'customer'
});

// Order - OrderItem: One to Many
Order.hasMany(OrderItem, {
    foreignKey: 'order_id',
    as: 'order_items'
});
OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
    as: 'order'
});

// Product - OrderItem: One to Many
Product.hasMany(OrderItem, {
    foreignKey: 'product_id',
    as: 'order_items'
});
OrderItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product'
});

// User - CartItem: One to Many
User.hasMany(CartItem, {
    foreignKey: 'user_id',
    as: 'cart_items'
});
CartItem.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// Product - CartItem: One to Many
Product.hasMany(CartItem, {
    foreignKey: 'product_id',
    as: 'cart_items'
});
CartItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product'
});

// Product - Review: One to Many
Product.hasMany(Review, {
    foreignKey: 'product_id',
    as: 'reviews'
});
Review.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product'
});

// Customer - Review: One to Many
Customer.hasMany(Review, {
    foreignKey: 'customer_id',
    as: 'reviews'
});
Review.belongsTo(Customer, {
    foreignKey: 'customer_id',
    as: 'customer'
});

// ============= Export Models =============

const db = {
    sequelize,
    Role,
    User,
    Category,
    Product,
    Customer,
    Order,
    OrderItem,
    CartItem,
    Review
};

export default db;
