const { Sequelize, DataTypes, QueryTypes } = require('sequelize');
const sequelize = new Sequelize({
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	dialect: process.env.DB_DIALECT,
	// By default, sequelize logs all SQL statements, which clutters the console.
	logging: () => false,
});
// you can redefine this file based on your preferences. Use class or set of functions if you wish.

// define model according to what you see in the description
// there is no need to create or sync database with sequelize's sync method or anything like that
// the database is running and migrated already
const model = sequelize.define(
	'notes',
	{
		added: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		author: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ timestamps: false }
);

const getAll = async (author) => {
	try {
		return await sequelize.query(
			author
				? 'SELECT * FROM `notes` WHERE author = '.concat(`'${author}'`)
				: 'SELECT * FROM `notes`',
			{ type: QueryTypes.SELECT }
		);
	} catch (ex) {}
};

const getById = async (id) => {
	try {
		const notesResponse = await sequelize.query(
			'SELECT * FROM `notes` WHERE id = '.concat(id),
			{
				type: QueryTypes.SELECT,
			}
		);
		console.log(notesResponse.length);
		if (!notesResponse.length) {
			return null;
		}
		return notesResponse[0];
	} catch (ex) {
		throw ex;
	}
};

const insertData = async (note) => {
	try {
		return sequelize.query(
			'INSERT INTO `notes` (`added`, `author`, `content`) VALUES'.concat(
				`('${note.added}', '${note.author}', '${note.content ? note.content : null}')`
			),
			{ type: QueryTypes.INSERT }
		);
	} catch (ex) {
		throw ex;
	}
};

module.exports = { model, getAll, getById, insertData };
