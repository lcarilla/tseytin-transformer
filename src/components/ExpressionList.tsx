import React, {useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";
import {Expr, ExprType, getSymbol} from "@/lib/logic.ts";

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
						placeholder="Variable C"
						value={newExpression.A}
						onChange={(e) => handleChange("A", e.target.value)}
					/>

					<div className="flex">
						<p className="pr-3">↔</p>
						{newExpression.type != ExprType.NOT && <Input
							placeholder="Variable A"
							value={newExpression.B}
							onChange={(e) => handleChange("B", e.target.value)}
						/>}
					</div>
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
						placeholder="Variable B"
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
										{expr.type === ExprType.NOT ? `${expr.A} ↔ ¬${expr.C}` : `${expr.A} ↔ ${expr.B} ${getSymbol(expr.type)} ${expr.C}`}
									</p>
								))
						) : (
							<p className="text-gray-500">No expressions available.</p>
						)}
						<p className="pt-5">Logical Symbols: ∧ (AND), ∨ (OR), ¬ (NOT), ⊕ (XOR), ↔ (XNOR, EXACTLY WHEN), ↓ (NOR), → (IMPLICATION)</p>
					</CardContent>
				</Card>

			</div>
		</div>
	);
};

export default ExpressionList;
