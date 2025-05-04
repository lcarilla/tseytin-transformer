"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header.tsx"

export default function MatrixCalculator() {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [matrix, setMatrix] = useState(
    Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0)),
  )
  const [result, setResult] = useState<number[][]>([])
  const [steps, setSteps] = useState<{ description: string; matrix: number[][] }[]>([])
  const [computed, setComputed] = useState(false)

  const handleMatrixChange = (rowIndex: number, colIndex: number, value: string) => {
    const newMatrix = [...matrix]
    newMatrix[rowIndex][colIndex] = value === "" ? 0 : Number(value)
    setMatrix(newMatrix)
  }

  const handleDimensionChange = (type: "rows" | "cols", value: string) => {
    const newDimension = Number.parseInt(value)

    if (type === "rows") {
      setRows(newDimension)
      const newMatrix = Array(newDimension)
        .fill(0)
        .map((_, i) => (i < matrix.length ? matrix[i] : Array(cols).fill(0)))
      setMatrix(newMatrix)
    } else {
      setCols(newDimension)
      const newMatrix = matrix.map((row) => {
        const newRow = Array(newDimension).fill(0)
        for (let i = 0; i < Math.min(row.length, newDimension); i++) {
          newRow[i] = row[i]
        }
        return newRow
      })
      setMatrix(newMatrix)
    }

    setComputed(false)
  }

  const computeStrongRowEchelonForm = () => {
    // Clone the matrix to avoid modifying the original
    let currentMatrix = matrix.map((row) => [...row])
    const computationSteps = []

    // Add initial matrix to steps
    computationSteps.push({
      description: "Initial matrix",
      matrix: currentMatrix.map((row) => [...row]),
    })

    // Forward elimination (Gaussian elimination)
    for (let i = 0; i < Math.min(rows, cols); i++) {
      // Find pivot
      let pivotRow = i
      while (pivotRow < rows && currentMatrix[pivotRow][i] === 0) {
        pivotRow++
      }

      // If no pivot found in this column, move to next column
      if (pivotRow === rows) continue

      // Swap rows if needed
      if (pivotRow !== i) {
        ;[currentMatrix[i], currentMatrix[pivotRow]] = [currentMatrix[pivotRow], currentMatrix[i]]
        computationSteps.push({
          description: `Swap row ${i + 1} and row ${pivotRow + 1}`,
          matrix: currentMatrix.map((row) => [...row]),
        })
      }

      // Scale the pivot row to make pivot element 1
      const pivot = currentMatrix[i][i]
      if (pivot !== 0 && pivot !== 1) {
        for (let j = i; j < cols; j++) {
          currentMatrix[i][j] /= pivot
        }
        computationSteps.push({
          description: `Scale row ${i + 1} by 1/${pivot}`,
          matrix: currentMatrix.map((row) => [...row]),
        })
      }

      // Eliminate other rows
      for (let k = 0; k < rows; k++) {
        if (k !== i && currentMatrix[k][i] !== 0) {
          const factor = currentMatrix[k][i]
          for (let j = i; j < cols; j++) {
            currentMatrix[k][j] -= factor * currentMatrix[i][j]
          }
          computationSteps.push({
            description: `Subtract ${factor} times row ${i + 1} from row ${k + 1}`,
            matrix: currentMatrix.map((row) => [...row]),
          })
        }
      }
    }

    // Back substitution to get strong row echelon form
    for (let i = Math.min(rows, cols) - 1; i >= 0; i--) {
      // Find the pivot column for this row
      let pivotCol = 0
      while (pivotCol < cols && currentMatrix[i][pivotCol] === 0) {
        pivotCol++
      }

      // If this row has no pivot, skip it
      if (pivotCol === cols) continue

      // Eliminate entries above the pivot
      for (let k = 0; k < i; k++) {
        if (currentMatrix[k][pivotCol] !== 0) {
          const factor = currentMatrix[k][pivotCol]
          for (let j = pivotCol; j < cols; j++) {
            currentMatrix[k][j] -= factor * currentMatrix[i][j]
          }
          computationSteps.push({
            description: `Subtract ${factor} times row ${i + 1} from row ${k + 1}`,
            matrix: currentMatrix.map((row) => [...row]),
          })
        }
      }
    }

    // Round to fix floating point errors
    currentMatrix = currentMatrix.map((row) => row.map((val) => Math.round(val * 1000000) / 1000000))

    computationSteps.push({
      description: "Final strong row echelon form",
      matrix: currentMatrix.map((row) => [...row]),
    })

    setResult(currentMatrix)
    setSteps(computationSteps)
    setComputed(true)
  }

  return (
    <div>
      <Header title="Matrix Calculator" repoUrl="https://github.com/lcarilla/tseytin-transformer"/>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Matrix Strong Row Echelon Form Calculator</h1>

        <div className="grid gap-8 md:grid-cols-[1fr_1fr] lg:grid-cols-[2fr_3fr]">
          <Card>
            <CardHeader>
              <CardTitle>Matrix Input</CardTitle>
              <CardDescription>Enter your matrix dimensions and values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="rows">Rows</Label>
                  <Select value={rows.toString()} onValueChange={(value) => handleDimensionChange("rows", value)}>
                    <SelectTrigger id="rows">
                      <SelectValue placeholder="Rows" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={`row-${num}`} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cols">Columns</Label>
                  <Select value={cols.toString()} onValueChange={(value) => handleDimensionChange("cols", value)}>
                    <SelectTrigger id="cols">
                      <SelectValue placeholder="Columns" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={`col-${num}`} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Matrix Values</Label>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full">
                      <tbody>
                        {Array(rows)
                          .fill(0)
                          .map((_, rowIndex) => (
                            <tr key={`row-${rowIndex}`}>
                              {Array(cols)
                                .fill(0)
                                .map((_, colIndex) => (
                                  <td key={`cell-${rowIndex}-${colIndex}`} className="p-1">
                                    <Input
                                      type="number"
                                      value={matrix[rowIndex][colIndex] || ""}
                                      onChange={(e) => handleMatrixChange(rowIndex, colIndex, e.target.value)}
                                      className="w-16 text-center"
                                    />
                                  </td>
                                ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={computeStrongRowEchelonForm} className="w-full">
                Compute Strong Row Echelon Form
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Strong row echelon form of your matrix</CardDescription>
            </CardHeader>
            <CardContent>
              {computed ? (
                <Tabs defaultValue="result">
                  <TabsList className="mb-4">
                    <TabsTrigger value="result">Final Result</TabsTrigger>
                    <TabsTrigger value="steps">Step by Step</TabsTrigger>
                  </TabsList>

                  <TabsContent value="result" className="space-y-4">
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full border">
                          <tbody>
                            {result.map((row, rowIndex) => (
                              <tr key={`result-row-${rowIndex}`}>
                                {row.map((cell, colIndex) => (
                                  <td key={`result-cell-${rowIndex}-${colIndex}`} className="p-2 border text-center">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="steps" className="space-y-8">
                    {steps.map((step, index) => (
                      <div key={`step-${index}`} className="space-y-2">
                        <h3 className="font-medium">
                          Step {index}: {step.description}
                        </h3>
                        <div className="overflow-x-auto">
                          <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full border">
                              <tbody>
                                {step.matrix.map((row, rowIndex) => (
                                  <tr key={`step-${index}-row-${rowIndex}`}>
                                    {row.map((cell, colIndex) => (
                                      <td
                                        key={`step-${index}-cell-${rowIndex}-${colIndex}`}
                                        className="p-2 border text-center"
                                      >
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-muted-foreground mb-4">
                    Enter your matrix and click "Compute" to see the strong row echelon form
                  </p>
                  <div className="grid grid-cols-3 gap-1 opacity-30">
                    {Array(9)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="w-12 h-12 border flex items-center justify-center">
                          {i % 4 === 0 ? 1 : 0}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">About Strong Row Echelon Form</h2>
          <p className="text-muted-foreground mb-4">
            A matrix is in <strong>strong row echelon form</strong> (also called reduced row echelon form) when:
          </p>
          <ul className="text-left list-disc pl-6 space-y-2 mb-4">
            <li>All rows consisting entirely of zeros are at the bottom.</li>
            <li>The leading entry (first non-zero element) of each non-zero row is 1.</li>
            <li>
              The leading entry of each non-zero row is in a column to the right of the leading entry of the row above it.
            </li>
            <li>All entries in a column above and below a leading 1 are zeros.</li>
          </ul>
          <p className="text-muted-foreground">
            This calculator performs Gaussian elimination followed by back substitution to transform any matrix into its
            strong row echelon form.
          </p>
        </div>
      </div>
    </div>
  )
} 