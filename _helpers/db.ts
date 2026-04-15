import config from '../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refreshToken.model';

const db: any = {};
export default db;

async function connect() {
    const { host, port, user, password, database } = config.database;

    // Create database if it does not exist yet.
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    // Connect Sequelize and initialize models.
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });
    await sequelize.authenticate();

    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    await sequelize.sync();
}

connect().catch((error: any) => {
    const { host, port, user, database } = config.database;
    console.error('Database initialization failed.');
    console.error(`Check config.json credentials for ${user}@${host}:${port}/${database}.`);
    console.error(error?.message || error);
    process.exit(1);
});