import { getAccessToken, paypal } from "../lib/paypal";

// Test to generate access token from PayPal
describe("PayPal API", () => {
	it("should get an access token", async () => {
		const token = await getAccessToken();
		// console.log("PayPal Access Token:", token);
		expect(typeof token).toBe("string");
		expect(token.length).toBeGreaterThan(0);
	});
});

// Test to create a PayPal order
describe("Create PayPal Order", () => {
	it("should create an order", async () => {
		const order = await paypal.createOrder(100);
		// console.log("PayPal Order ID: ", order.id);
		expect(order).toHaveProperty("id");
		expect(order).toHaveProperty("status");
		expect(order.status).toBe("CREATED");
	});
});

// Test to capture a PayPal payment with a mock order
test("simulate capturing a PayPal payment from an order", async () => {
	const mockOrderId = "100"; // Replace with a valid order ID for real tests
	const mockCapturePayment = jest
		.spyOn(paypal, "capturePayment")
		.mockResolvedValue({
			status: "COMPLETED",
		});

	const response = await paypal.capturePayment(mockOrderId);
	expect(response).toHaveProperty("status", "COMPLETED");

	mockCapturePayment.mockRestore();
});
