import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const IconBoxes = () => {
	return (
		<div className="my-20 bg-base-200 shadow-sm rounded-box">
			<Card>
				<CardContent className="grid md:grid-cols-4 gap-4 p-4">
					<div className="space-y-2">
						<ShoppingBag />
						<div className="text-sm font-bold">Free Shipping</div>
						<div className="text-sm">
							Free shipping on orders above $100
						</div>
					</div>
					<div className="space-y-2">
						<DollarSign />
						<div className="text-sm font-bold">
							Money Back Guarantee
						</div>
						<div className="text-sm">
							Within 30 days of delivery
						</div>
					</div>
					<div className="space-y-2">
						<WalletCards />
						<div className="text-sm font-bold">
							Flexible Payments
						</div>
						<div className="text-sm">
							Pay with credit card, PayPal or Cash on delivery
						</div>
					</div>
					<div className="space-y-2">
						<Headset />
						<div className="text-sm font-bold">
							24/7 Customer Support
						</div>
						<div className="text-sm">
							We&apos;re here to help you anytime
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default IconBoxes;
