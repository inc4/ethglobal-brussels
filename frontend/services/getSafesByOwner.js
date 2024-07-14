import SafeApiKit from "@safe-global/api-kit";

const apiKit = new SafeApiKit({
	chainId: 11155111n
})

export async function getSafesByOwner(ownerAddress) {
	try {
		const { safes} = await apiKit.getSafesByOwner(ownerAddress);

		const promises = safes.map((safeAddress) => {
			return apiKit.getSafeInfo(safeAddress);
		})

		return await Promise.all(promises);
	} catch (error) {
		console.log('error getting safes by owner')
		console.error(error)
		return [];
	}
}
