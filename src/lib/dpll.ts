import { CNFClause } from '@/lib/logic.ts';

export interface RuleResult {
	variable: string;
	valueToBeSet: boolean;
}

export interface Log {
	clauses: CNFClause[],
	log: string,
	depth: string
}
export function DPLLWrapper (input: CNFClause[]) {
	const logs: Log[] = [];
	function checkOLR(clauses: CNFClause[]): RuleResult | undefined {
		for (const clause of clauses) {
			if (clause.literals.length === 1) {
				const singleLiteral = clause.literals[0];
				const valueToBeSet = !singleLiteral.negated;
				return { variable: singleLiteral.variable, valueToBeSet };
			}
		}

		return undefined;
	}

	function checkPLR(clauses: CNFClause[]): RuleResult | undefined {
		const literalCounts = new Map<
			string,
			{ positive: number; negative: number }
		>();

		for (const clause of clauses) {
			for (const literal of clause.literals) {
				const variable = literal.variable;
				const entry = literalCounts.get(variable) || { positive: 0, negative: 0 };

				if (literal.negated) {
					entry.negative++;
				} else {
					entry.positive++;
				}

				literalCounts.set(variable, entry);
			}
		}

		for (const [variable, counts] of literalCounts.entries()) {
			if (counts.positive > 0 && counts.negative === 0) {
				return { variable, valueToBeSet: true };
			}
			if (counts.negative > 0 && counts.positive === 0) {
				return { variable, valueToBeSet: false };
			}
		}

		return undefined;
	}

	function findRemainingLiterals(clauses: CNFClause[]): string[] {
		const literalsSet = new Set<string>();
		clauses.forEach(clause => {
			clause.literals.forEach(literal => {
				literalsSet.add(literal.variable);
			});
		});

		return Array.from(literalsSet);
	}

	function DPLL(clauses: CNFClause[], currentDepth: string): boolean {
		if(hasEmptyClauses(clauses)){
			return false;
		}
		const olrRes = checkOLR(clauses);
		if (olrRes) {
			const newClauses = applyAssignment(
				clauses,
				olrRes.variable,
				olrRes.valueToBeSet
			);
			logs.push({log: `Applying OLR: ${olrRes.variable} = ${olrRes.valueToBeSet}`, clauses: [...newClauses], depth: currentDepth + "0"})
			if(DPLL(newClauses, currentDepth + "0")){
				return true;
			}
		}

		const plrRes = checkPLR(clauses);
		if (plrRes) {
			const newClauses = applyAssignment(
				clauses,
				plrRes.variable,
				plrRes.valueToBeSet
			);
			logs.push({log: `Applying PLR: ${plrRes.variable} = ${plrRes.valueToBeSet}`, clauses: [...newClauses], depth: currentDepth + "1"})
			if(DPLL(newClauses, currentDepth + "1")){
				return true;
			}
		}

		const remainingLiterals = findRemainingLiterals(clauses);
		if (remainingLiterals.length === 0) {
			return true;
		}

		const smallestLiteral = remainingLiterals.sort()[0];

		// Branch: Try setting the smallest literal to true
		const newClausesTrue = applyAssignment(clauses, smallestLiteral, true);
		logs.push({log: `Setting Variable to true: ${smallestLiteral} = true`, clauses: [...newClausesTrue], depth: currentDepth + "2"})
		const resultTrue = DPLL([...newClausesTrue],  currentDepth + "2");
		if (resultTrue) {
			return true;
		}

		// Branch: Try setting the smallest literal to false
		const newClausesFalse = applyAssignment(clauses, smallestLiteral, false);
		logs.push({log: `Setting Variable to false: ${smallestLiteral} = false`, clauses: [...newClausesFalse], depth: currentDepth + "3"})

		const resultFalse = DPLL([...newClausesFalse],  currentDepth + "3");
		if (resultFalse) {
			return true;
		}

		// If both branches fail, the formula is unsatisfiable
		return false;
	}

	function hasEmptyClauses(clauses: CNFClause[]): boolean{
		return clauses.some(clause => clause.literals.length == 0);
	}

	function applyAssignment(
		clauses: CNFClause[],
		variable: string,
		value: boolean
	): CNFClause[] {
		return clauses
			.map(clause => {
				return {
					literals: clause.literals.filter(literal => {
						// If the literal matches the variable and its negation satisfies the value, the clause is satisfied
						if (literal.variable === variable) {
							if (literal.negated === value) {
								return false; // Remove the literal as it satisfies the clause
							}
						}
						return true; // Keep other literals
					}),
				};
			})
			.filter(clause => {
				// Keep clauses even if they become empty (indicating unsatisfied clauses)
				const isClauseSatisfied = clause.literals.some(
					literal =>
						literal.variable === variable && literal.negated !== value
				);
				return !isClauseSatisfied;
			});
	}


	logs.push({log: "DPLL start", clauses: [...input], depth: "0"})
	const res = DPLL(input, "0");

	return {logs, res};
}