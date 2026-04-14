import config from '../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/accounts.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

async function connect(){
    const {host, port, user, password, database} = config.database;
    const connection = await mysql.createConnection({host, port, user, password});

    //Creat db if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    //Connect to db
    const sequelize = new Sequelize(database, user, password, {dialect: 'mysql'});
    //init modls
    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);
    //defin relationships
    db.Account.hasMany(db.RefreshTokn, {onDelete: 'CASCADE'});
    db.RefreshToken.belongsTo(db.Account);

    //Sync modls with db
    await sequelize.sync();
}