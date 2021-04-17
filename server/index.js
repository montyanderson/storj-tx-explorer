const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
	"postgres://postgres:password@postgres:5432/vortex"
);

const Transaction = sequelize.define("Transaction", {
	blockHash: DataTypes.STRING,
	blockNumber: DataTypes.INTEGER,
	from: DataTypes.STRING,
	to: DataTypes.STRING,
	hash: {
		type: DataTypes.STRING,
		unique: true
	},
	input: DataTypes.TEXT,
	nonce: DataTypes.INTEGER,
	timestamp: DataTypes.INTEGER
});

const Koa = require("koa");
const Router = require("@koa/router");

const app = new Koa();
const router = new Router();

router.get("/api", async (ctx) => {
	const txs = await Transaction.findAll();

	ctx.body = JSON.stringify(txs);
});

router.get("/api/search", async (ctx) => {
	ctx.body = "Hello!";
});

app.use(router.routes()).use(router.allowedMethods());

(async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}

	await sequelize.sync();
})();

app.listen(80);
