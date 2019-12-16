export const checkAmount = (amount: number) => {
	let newAmount =
		"$" + amount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	if (amount < 0) {
		newAmount = newAmount.toLocaleString().replace("$-", "-$");
	}
	return newAmount;
};
