export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'avatar', {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'URL to user avatar image'
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'avatar');
}
