const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

export const paypal = {
	createOrder: async function createOrder(price: number) {
		const accessToken = await getAccessToken();
		const url = `${base}/v2/checkout/orders`;

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				intent: "CAPTURE",
				purchase_units: [
					{
						amount: {
							currency_code: "CAD",
							value: price,
						},
					},
				],
			}),
		});
		return handleResponse(response);
	},
	capturePayment: async function capturePayment(orderId: string) {
		const accessToken = await getAccessToken();
		const url = `${base}/v2/checkout/orders/${orderId}/capture`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});
		return handleResponse(response);
	},
};

export async function getAccessToken(): Promise<string> {
	const clientId = process.env.PAYPAL_CLIENT_ID! as string;
	const appSecret = process.env.PAYPAL_APP_SECRET! as string;

	const auth = Buffer.from(`${clientId}:${appSecret}`).toString("base64");
	const response = await fetch(`${base}/v1/oauth2/token`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${auth}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: "grant_type=client_credentials",
	});

	const data = await handleResponse(response);
	return data.access_token;
}

async function handleResponse(response: Response) {
	if (response.status === 200 || response.status === 201) {
		return response.json();
	}
	const errorMessage = await response.text();
	throw new Error(errorMessage);
}
