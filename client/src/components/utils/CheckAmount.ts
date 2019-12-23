export const checkAmount = (amount: number) => {
	let newAmount = "$" + amount.toFixed(2);
	if (amount < 0) {
		newAmount = newAmount.replace("$-", "-$");
	}
	return newAmount;
};
