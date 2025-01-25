import ExpressionList from "@/components/ExpressionList.tsx";
import {useState} from "react";
import {CNFClause, Expr, generateDIMACSFormat, transform} from "@/lib/logic.ts";
import Header from "@/components/header.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

function App() {
	const [expressions, setExpressions] = useState<Expr[]>([]);
	const [cnfResults, setCnfResults] = useState<CNFClause[]>([]);
	const [dimacsResults, setDimacsResults] = useState<string | undefined>(undefined);

	const handleGenerateCNF = () => {
		const results = transform(expressions);
		setCnfResults(results);
		setDimacsResults(generateDIMACSFormat(results))
	};

	return (
		<div>
			<Header title="Tseytin Transformer" repoUrl="https://github.com/lcarilla/tseytin-transformer"/>
			<div className="p-4 space-y-4">
				<div className="flex">
					<div className="w-1/2">
						<p>
							This app will convert the Operations to the respective CNF sub-expressions so you don't have to go crazy doing it manually.
						</p>
						<p>It also provides the CNF expression in a DIMACS format (<a
							href="https://people.sc.fsu.edu/~jburkardt/data/cnf/cnf.html">https://people.sc.fsu.edu/~jburkardt/data/cnf/cnf.html</a>)</p>
					</div>
					<div className="w-1/2 flex items-center justify-center">
						<img src="/gates_cnf.png" className="h-64" alt=""/>
					</div>
				</div>
				<ExpressionList
					expressions={expressions}
					onExpressionsChange={setExpressions}
				/>
				<Button
					onClick={handleGenerateCNF}
					className="px- py-4"
				>
					Generate CNF
				</Button>
				{cnfResults.length > 0 && (
					<>
						<Card className="p-4 mb-4">
							<div className="space-y-2">
								<h2 className="text-lg font-semibold">CNF Results:</h2>
								<ul className="list-disc pl-5">
									{cnfResults.map((clause, index) => (
										<p key={index} className="text-sm">
											{clause.literals
												.map(
													(literal) =>
														`${literal.negated ? "¬" : ""}${literal.variable}`
												)
												.join(" ∨ ")}
										</p>
									))}
								</ul>
							</div>
						</Card>
						{dimacsResults && <Card className="p-4">
							<div className="space-y-2">
								<h2 className="text-lg font-semibold">DIMACS-like Format (not mapped to numbers):</h2>
								<pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
									{dimacsResults}
								</pre>
							</div>
						</Card>}
					</>
				)}
			</div>
		</div>
	);
}

export default App;
