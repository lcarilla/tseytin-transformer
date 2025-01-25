export enum ExprType {
	XOR = "XOR",
	AND = "AND",
	OR = "OR",
	NOT = "NOT",
	NOR = "NOR",
	XNOR = "XNOR"
}

export interface Expr {
	A: string;
	type: ExprType;
	B: string;
	C: string;
}

export interface CNFClause {
	literals: CNFLiteral[]
}

export interface CNFLiteral {
	negated: boolean
	variable: string
}

export function transform(exprs: Expr[]): CNFClause[] {
	const clauses: CNFClause[] = [];

	exprs.forEach(expr => {
		switch (expr.type) {
			case ExprType.AND: {
				clauses.push(
					{ literals: [{ variable: expr.B, negated: true }, { variable: expr.C, negated: true }, { variable: expr.A, negated: false }] },
					{ literals: [{ variable: expr.B, negated: false }, { variable: expr.A, negated: true }] },
					{ literals: [{ variable: expr.C, negated: false }, { variable: expr.A, negated: true }] }
				);
				break;
			}
			case ExprType.OR: {
				clauses.push(
					{ literals: [{ variable: expr.B, negated: false }, { variable: expr.C, negated: false }, { variable: expr.A, negated: true }] },
					{ literals: [{ variable: expr.B, negated: true }, { variable: expr.A, negated: false }] },
					{ literals: [{ variable: expr.C, negated: true }, { variable: expr.A, negated: false }] }
				);
				break;
			}
			case ExprType.XOR: {
				clauses.push(
					{ literals: [{ variable: expr.B, negated: true }, { variable: expr.C, negated: true }, { variable: expr.A, negated: true }] },
					{ literals: [{ variable: expr.B, negated: false }, { variable: expr.C, negated: false }, { variable: expr.A, negated: true }] },
					{ literals: [{ variable: expr.B, negated: true }, { variable: expr.C, negated: false }, { variable: expr.A, negated: false }] },
					{ literals: [{ variable: expr.B, negated: false }, { variable: expr.C, negated: true }, { variable: expr.A, negated: false }] }
				);
				break;
			}
			case ExprType.NOT: {
				clauses.push(
					{ literals: [{ variable: expr.B, negated: false }, { variable: expr.A, negated: false }] },
					{ literals: [{ variable: expr.B, negated: true }, { variable: expr.A, negated: true }] }
				);
				break;
			}
			case ExprType.NOR: {
				clauses.push(
					{ literals: [{ variable: expr.B, negated: false }, { variable: expr.C, negated: false }, { variable: expr.A, negated: false }] },
					{ literals: [{ variable: expr.B, negated: true }, { variable: expr.A, negated: true }] },
					{ literals: [{ variable: expr.C, negated: true }, { variable: expr.A, negated: true }] }
				);
				break;
			}
			case ExprType.XNOR: {
				clauses.push(
					{ literals: [{ variable: expr.B, negated: false }, { variable: expr.C, negated: false }, { variable: expr.A, negated: false }] },
					{ literals: [{ variable: expr.B, negated: true }, { variable: expr.C, negated: true }, { variable: expr.A, negated: false }] },
					{ literals: [{ variable: expr.B, negated: false }, { variable: expr.C, negated: true }, { variable: expr.A, negated: true }] },
					{ literals: [{ variable: expr.B, negated: true }, { variable: expr.C, negated: false }, { variable: expr.A, negated: true }] }
				);
				break;
			}
		}
	});

	return clauses;
}


export const generateDIMACSFormat = (cnfResults: CNFClause[]) => {
	const clauseCount = cnfResults.length;

	const header = `p cnf $MAX_LITERAL ${clauseCount}`;
	const clauses = cnfResults.map((clause) =>
		clause.literals
			.map((literal) => `${literal.negated ? "-" : ""}${literal.variable}`)
			.join(" ") + " 0"
	);

	return ["c CNF Results in DIMACS format", header, ...clauses].join("\n");
};