<template>
	<div class="home">
		<h1>Hello, World!</h1>

		<table>
			<tr>
				<th>Timestamp</th>
				<th>From</th>
				<th>To</th>
				<th>Hash</th>
			</tr>

			<tr v-for="tx in txs" v-bind:key="tx.hash">
				<td>{{ tx.timestamp }}</td>
				<td>{{ tx.from }}</td>
				<td>{{ tx.to }}</td>
				<td>{{ tx.hash }}</td>
			</tr>
		</table>
	</div>
</template>

<script>
export default {
	data: () => ({
		txs: []
	}),
	async created() {
		const response = await fetch("/api");

		this.txs = await response.json();
	}
};
</script>
