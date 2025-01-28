import { Card, CardContent } from "@/components/ui/card";
import { CopyIcon, Trash2 } from "lucide-react";
import { Expr, ExprType, getSymbol } from "@/lib/logic.ts";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ExpressionListProps = {
  onExpressionsChange: (expressions: Expr[]) => void;
  expressions: Expr[];
  shareLink: string;
};

const ExpressionList: React.FC<ExpressionListProps> = ({
  onExpressionsChange,
  expressions,
  shareLink,
}) => {
  const [newExpression, setNewExpression] = useState<Expr>({
    A: "",
    type: ExprType.AND,
    B: "",
    C: "",
  });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddExpression = () => {
    onExpressionsChange([...expressions, newExpression]);
    setNewExpression({ A: "", type: ExprType.AND, B: "", C: "" });
  };

  const handleRemoveExpression = (index: number) => {
    const updatedExpressions = expressions.filter((_, i) => i !== index);
    onExpressionsChange(updatedExpressions);
  };

  const handleChange = (field: keyof Expr, value: string) => {
    setNewExpression({ ...newExpression, [field]: value });
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        alert("Share link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  //drag and drop
  // Drag-and-Drop Handlers
  const handleDragStart = (index: number) => {
    console.log("start drag");
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Allows drop
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;

    const updatedExpressions = [...expressions];
    const [draggedItem] = updatedExpressions.splice(draggedIndex, 1);
    updatedExpressions.splice(index, 0, draggedItem);

    onExpressionsChange(updatedExpressions);
    setDraggedIndex(null);
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
            {newExpression.type !== ExprType.NOT &&
              newExpression.type !== ExprType.TRUE && (
                <Input
                  placeholder="Variable A"
                  value={newExpression.B}
                  onChange={(e) => handleChange("B", e.target.value)}
                />
              )}
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

          <div>
            {newExpression.type !== ExprType.TRUE && (
              <Input
                placeholder="Variable B"
                value={newExpression.C}
                onChange={(e) => handleChange("C", e.target.value)}
              />
            )}
          </div>

          <Button onClick={handleAddExpression}>Add Expression</Button>
        </div>
      </Card>

      <div>
        <Card className="p-4 mb-2">
          <div className="flex justify-between items-center mt-4">
            <h2 className="text-xl font-bold mb-4">Expressions:</h2>
            <CopyIcon onClick={handleCopyLink}>Copy Share Link</CopyIcon>
          </div>
          <CardContent>
            {expressions.length > 0 ? (
              expressions.map((expr, index) => (
                <div
                  key={index}
                  className="flex mb-2 p-1 border border-gray-200 rounded cursor-grab"
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  draggable
                >
                  <button
                    onClick={() => handleRemoveExpression(index)}
                    className="flex items-center mr-3"
                  >
                    <Trash2 size={16} className="text-gray-500" />
                  </button>
                  <p>
                    {expr.type === ExprType.TRUE && `${expr.A} ↔ true`}
                    {expr.type !== ExprType.TRUE &&
                      (expr.type === ExprType.NOT
                        ? `${expr.A} ↔ ¬${expr.C}`
                        : `${expr.A} ↔ ${expr.B} ${getSymbol(expr.type)} ${
                            expr.C
                          }`)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No expressions available.</p>
            )}
            <p className="pt-5">
              Logic Symbols: ∧ (AND), ∨ (OR), ¬ (NOT), ⊕ (XOR), ↔ (XNOR, EXACTLY
              WHEN), ↓ (NOR), → (IMPLICATION)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpressionList;
