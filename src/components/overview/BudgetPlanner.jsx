import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import useDataStore from "@/hooks/useDataStore";

export default function BudgetPlanner() {
  const { pay, categories, expenses } = useDataStore();
  const [budgets, setBudgets] = useState({});
  const [unallocated, setUnallocated] = useState(pay);
  const [savedBudgets, setSavedBudgets] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("budgets");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  // Initialize budgets from localStorage on component mount
  useEffect(() => {
    if (Object.keys(savedBudgets).length > 0) {
      setBudgets(savedBudgets);
      calculateUnallocated(savedBudgets);
    } else {
      initializeDefaultBudgets();
    }
  }, [pay, categories]);
  
  useEffect(() => {
    if (typeof window !== "undefined" && Object.keys(budgets).length > 0) {
      localStorage.setItem("budgets", JSON.stringify(budgets));
    }
  }, [budgets]);
  
  const initializeDefaultBudgets = () => {
    if (categories.length > 0) {
      const defaultBudget = {};
      const evenAllocation = pay / categories.length;
      
      categories.forEach(category => {
        defaultBudget[category.category] = Math.floor(evenAllocation);
      });
      
      setBudgets(defaultBudget);
      calculateUnallocated(defaultBudget);
    }
  };
  
  const calculateUnallocated = (budgetData) => {
    const total = Object.values(budgetData).reduce((sum, amount) => sum + amount, 0);
    setUnallocated(pay - total);
  };
  
  const handleBudgetChange = (category, value) => {
    const newBudgets = { ...budgets, [category]: value };
    setBudgets(newBudgets);
    calculateUnallocated(newBudgets);
  };
  
  const calculateCategorySpending = (categoryName) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return expenses
      .filter(expense => {
        const date = new Date(expense.dateSpent);
        return expense.spendingCategory === categoryName && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .reduce((total, expense) => total + expense.totalAmount, 0);
  };
  
  const resetBudgets = () => {
    initializeDefaultBudgets();
  };
  
  return (
    <div className="w-full max-w-5xl">
      <h2 className="text-2xl font-bold mb-6">Budget Planner</h2>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Monthly Budget Allocation</CardTitle>
          <CardDescription>Distribute your income across spending categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Monthly Income</p>
              <p className="text-2xl font-bold">${pay}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unallocated</p>
              <p className={`text-2xl font-bold ${unallocated < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${unallocated.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {categories.map(category => {
              const categoryName = category.category;
              const budgetAmount = budgets[categoryName] || 0;
              const spentAmount = calculateCategorySpending(categoryName);
              const percentSpent = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
              
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{categoryName}</p>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        className="w-24"
                        value={budgetAmount}
                        onChange={(e) => handleBudgetChange(categoryName, Number(e.target.value))}
                      />
                      <p className="text-sm">
                        <span className={percentSpent > 100 ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                          ${spentAmount.toFixed(2)} spent
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <Slider
                    value={[budgetAmount]}
                    max={pay}
                    step={10}
                    onValueChange={(values) => handleBudgetChange(categoryName, values[0])}
                    className="cursor-pointer"
                  />
                  
                  {/* Budget progress bar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Budget Usage</span>
                      <span className="text-xs">{percentSpent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          percentSpent > 100 ? 'bg-red-600' : 
                          percentSpent > 80 ? 'bg-yellow-500' : 'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(percentSpent, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={resetBudgets} variant="outline" className="ml-auto">Reset Allocations</Button>
        </CardFooter>
      </Card>
    </div>
  );
}