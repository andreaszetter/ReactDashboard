import { useEffect, useState } from "react";
import useDataStore from "@/hooks/useDataStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SavingsTracker() {
  const { goals, expenses, pay } = useDataStore();
  const [savingsData, setSavingsData] = useState([]);
  const [activeGoals, setActiveGoals] = useState([]);
  const [savingsPrediction, setSavingsPrediction] = useState({
    monthlySavings: 0,
    annualSavings: 0,
    goalProgress: {}
  });

  useEffect(() => {
    if (expenses && pay) {
      // Group expenses by month to calculate savings
      const byMonth = {};
      
      expenses.forEach(expense => {
        const date = new Date(expense.dateSpent);
        const month = date.getMonth();
        const year = date.getFullYear();
        const monthKey = `${year}-${month+1}`;
        
        if (!byMonth[monthKey]) {
          byMonth[monthKey] = {
            month: monthKey,
            expenses: 0,
            income: pay,
            savings: pay
          };
        }
        
        byMonth[monthKey].expenses += expense.totalAmount;
        byMonth[monthKey].savings = byMonth[monthKey].income - byMonth[monthKey].expenses;
      });
      
      // Add into an array so that they are usable by chart
      const savingsArray = Object.values(byMonth).map(monthData => ({
        name: monthData.month,
        savings: monthData.savings,
        expenses: monthData.expenses,
        income: monthData.income
      }));
      
      // Sort by date
      savingsArray.sort((a, b) => {
        return new Date(a.name) - new Date(b.name);
      });
      
      setSavingsData(savingsArray);
      
      // Calculate current month's projected savings
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const monthKey = `${currentYear}-${currentMonth+1}`;
      
      const currentMonthExpenses = expenses
        .filter(expense => {
          const date = new Date(expense.dateSpent);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((total, expense) => total + expense.totalAmount, 0);
      
      const monthlySavings = pay - currentMonthExpenses;
      const annualSavings = monthlySavings * 12;
      
      // Find active goals
      const currentActiveGoals = goals.filter(goal => {
        const startDate = new Date(goal.startDate);
        const endDate = new Date(goal.endDate);
        return startDate <= currentDate && endDate >= currentDate;
      });
      
      // Calculate progress for each goal
      const goalProgress = {};
      currentActiveGoals.forEach(goal => {
        const startDate = new Date(goal.startDate);
        const endDate = new Date(goal.endDate);
        const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
        const elapsedDays = (currentDate - startDate) / (1000 * 60 * 60 * 24);
        const timeProgress = (elapsedDays / totalDays) * 100;
        
        // Estimate based on current savings rate
        const targetAmount = goal.target;
        const daysLeft = (endDate - currentDate) / (1000 * 60 * 60 * 24);
        const monthsLeft = daysLeft / 30;
        const projectedSavings = monthsLeft * monthlySavings;
        
        goalProgress[goal.id] = {
          timeProgress: Math.min(100, Math.max(0, timeProgress)),
          projectedAmount: projectedSavings,
          willReachTarget: projectedSavings >= targetAmount,
          targetAmount,
          daysLeft: Math.max(0, Math.floor(daysLeft)),
          percentToTarget: (projectedSavings / targetAmount) * 100
        };
      });
      
      setActiveGoals(currentActiveGoals);
      setSavingsPrediction({
        monthlySavings,
        annualSavings,
        goalProgress
      });
    }
  }, [expenses, pay, goals]);

  return (
    <div className="w-full max-w-5xl">
      <h2 className="text-2xl font-bold mb-6">Savings & Goals Tracker</h2>
      
      {/* Savings Prediction */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Projected Savings</CardTitle>
          <CardDescription>Based on your current income and spending habits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-md">
              <p className="text-sm text-muted-foreground">Monthly Savings</p>
              <p className={`text-2xl font-bold ${savingsPrediction.monthlySavings < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${savingsPrediction.monthlySavings.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-md">
              <p className="text-sm text-muted-foreground">Annual Savings (Projected)</p>
              <p className={`text-2xl font-bold ${savingsPrediction.annualSavings < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${savingsPrediction.annualSavings.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Active Goals Progress */}
      {activeGoals.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Savings Goals</CardTitle>
            <CardDescription>Track your progress towards financial goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activeGoals.map(goal => {
                const progress = savingsPrediction.goalProgress[goal.id];
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">${goal.target} Goal</h3>
                        <p className="text-sm text-muted-foreground">
                          {goal.startDate} to {goal.endDate} ({progress.daysLeft} days left)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          Projected: ${progress.projectedAmount.toFixed(2)}
                        </p>
                        <p className={`text-sm ${progress.willReachTarget ? 'text-green-600' : 'text-red-600'}`}>
                          {progress.willReachTarget 
                            ? 'On track to meet goal!' 
                            : `${(progress.percentToTarget).toFixed(1)}% of target`}
                        </p>
                      </div>
                    </div>
                    
                    {/* Time progress bar */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Time Elapsed</span>
                        <span className="text-xs">{progress.timeProgress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full bg-blue-600"
                          style={{ width: `${progress.timeProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Goal progress bar */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Savings Progress</span>
                        <span className="text-xs">{Math.min(100, progress.percentToTarget).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            progress.percentToTarget >= 100 ? 'bg-green-600' : 
                            progress.percentToTarget >= 70 ? 'bg-blue-600' : 
                            progress.percentToTarget >= 50 ? 'bg-yellow-500' : 'bg-red-600'
                          }`}
                          style={{ width: `${Math.min(100, progress.percentToTarget)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Savings History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Savings History</CardTitle>
          <CardDescription>Your saving patterns over time</CardDescription>
        </CardHeader>
        <CardContent>
          {savingsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={savingsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, '']} />
                <Legend />
                <Line type="monotone" dataKey="income" name="Income" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ff7300" />
                <Line type="monotone" dataKey="savings" name="Savings" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-10">No savings history available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}