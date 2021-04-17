const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
	"postgres://postgres:password@postgres:5432/vortex"
);
const Web3 = require("web3");
const web3 = new Web3("ws://host.docker.internal:3334");

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

// yield all transactions involving storj token contract
async function* getStorjTransactions() {
	const address = "0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC"; // contract address
	const startBlock = 3898942 + 1; // contract creation + 1
	//const endBlock = 12260463;
	const endBlock = startBlock + 5;

	for (let i = startBlock; i < endBlock; i++) {
		const { timestamp, transactions } = await web3.eth.getBlock(i, true);

		for (const tx of transactions) {
			if (tx.from === address || tx.to === address) {
				yield {
					...tx,
					timestamp
				};
			}
		}
	}

	console.log("done");
}

(async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}

	await sequelize.sync();

	let txs = 0;

	console.log("Running");

	for await (const {
		blockHash,
		blockNumber,
		from,
		to,
		hash,
		input,
		nonce,
		timestamp
	} of getStorjTransactions()) {
		const tx = Transaction.build({
			blockHash,
			blockNumber,
			from,
			to,
			hash,
			input,
			nonce,
			timestamp
		});

		await tx.save();

		if (++txs % 1000 === 0) {
			console.log("processed", txs, "transactions");
		}
	}
})();
