import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import {Expr, ExprType} from "@/lib/logic.ts";

type ExpressionListProps = {
	onExpressionsChange: (expressions: Expr[]) => void;
	expressions: Expr[];
}
const ExpressionList: React.FC<ExpressionListProps> = ({
	onExpressionsChange, expressions
													   }) => {
	const [newExpression, setNewExpression] = useState<Expr>({ A: "", type: ExprType.AND, B: "", C: "" });

	const handleAddExpression = () => {
		onExpressionsChange([...expressions, newExpression]);
		setNewExpression({ A: "", type: ExprType.AND, B: "", C: "" });
	};

	const handleChange = (field: keyof Expr, value: string) => {
		setNewExpression({ ...newExpression, [field]: value });
	};

	return (
		<div>
			<Card className="p-4 mb-4">
				<h2 className="text-xl font-bold mb-4">Add Expression</h2>
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
					<Input
						placeholder="Value A"
						value={newExpression.A}
						onChange={(e) => handleChange("A", e.target.value)}
					/>

					<div className="flex">
						<p className="pr-3">↔</p>
					<Input
						placeholder="Value B"
						value={newExpression.B}
						onChange={(e) => handleChange("B", e.target.value)}
					/></div>
					<Select
						value={newExpression.type}
						onValueChange={(value) => handleChange("type", value)}
					>
						<SelectTrigger className="w-full">
							<span>{newExpression.type}</span>
						</SelectTrigger>
						<SelectContent>
							{Object.keys(ExprType).map((type) => (
								<SelectItem key={type} value={type}>
									{type}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Input
						placeholder="Value C"
						value={newExpression.C}
						onChange={(e) => handleChange("C", e.target.value)}
					/>

					<Button onClick={handleAddExpression}>Add Expression</Button>
				</div>
			</Card>

			<div>
				<Card className="p-4 mb-2">
					<h2 className="text-xl font-bold mb-4">Expressions:</h2>
					<CardContent>
						{expressions.length > 0 ? (
								expressions.map((expr, index) => (
									<p key={index}>
										{expr.A} ↔ {expr.B} {expr.type} {expr.C}
									</p>
								))
						) : (
							<p className="text-gray-500">No expressions available.</p>
						)}
					</CardContent>
				</Card>

			</div>
		</div>
	);
};

export default ExpressionList;
