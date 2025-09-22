"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

type SalesDataType = {
	data: { salesData: { month: string; totalSales: number }[] };
};

const Charts = ({ data: { salesData } }: SalesDataType) => {
	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart
				data={salesData}
				margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
			>
				<XAxis
					dataKey="month"
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `$${value}`}
				/>
				<Bar
					dataKey="totalSales"
					fill="currentColor"
					radius={[4, 4, 0, 0]}
					className="fill-primary"
				/>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default Charts;
