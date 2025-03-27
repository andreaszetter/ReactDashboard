import { useEffect, useState } from "react";
import useDataStore from "@/hooks/useDataStore";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function SpendingInfo() {
  const { expenses, categories, pay } = useDataStore();
  const [monthlySpending, setMonthlySpending] = useState({});
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState({
    totalSpent: 0,
    remaining: 0,
    percentageSpent: 0
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  useEffect(() => {
    if (expenses && expenses.length > 0) {
      const byMonth = {};
      
      const byCategory = {};
      
      let totalSpentCurrentMonth = 0;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      expenses.forEach(expense => {
        const date = new Date(expense.dateSpent);
        const month = date.getMonth();
        const year = date.getFullYear();
        const monthKey = `${year}-${month+1}`;
        
        if (!byMonth[monthKey]) {
          byMonth[monthKey] = 0;
        }
        byMonth[monthKey] += expense.totalAmount;
        
        // Add to category totals
        if (!byCategory[expense.spendingCategory]) {
          byCategory[expense.spendingCategory] = 0;
        }
        byCategory[expense.spendingCategory] += expense.totalAmount;
        
        if (month === currentMonth && year === currentYear) {
          totalSpentCurrentMonth += expense.totalAmount;
        }
      });
      // makes an array with info about how the chart should look
      const categoryData = Object.keys(byCategory).map((category, index) => ({
        name: category,
        value: byCategory[category],
        fill: COLORS[index % COLORS.length]
      }));
      // similar to categoryData but this chart only need date and amount spent
      const monthlyData = Object.keys(byMonth).map(month => {
        const [year, monthNum] = month.split('-');
        return {
          month: `${monthNum}/${year}`,
          amount: byMonth[month]
        };
      });
      
      monthlyData.sort((a, b) => {
        const [aMonth, aYear] = a.month.split('/');
        const [bMonth, bYear] = b.month.split('/');
        return new Date(`${aYear}-${aMonth}`) - new Date(`${bYear}-${bMonth}`);
      });
      
      const remaining = pay - totalSpentCurrentMonth;
      const percentageSpent = pay > 0 ? (totalSpentCurrentMonth / pay) * 100 : 0;
      
      setMonthlySpending(monthlyData);
      setCategoryTotals(categoryData);
      setBudgetStatus({
        totalSpent: totalSpentCurrentMonth,
        remaining,
        percentageSpent
      });
    }
  }, [expenses, pay]);

  const chartConfig = {
    expense: {
      label: "Expense",
    },
    ...categories.reduce((acc, category) => {
      acc[category.category] = {
        label: category.category,
        color: COLORS[categories.indexOf(category) % COLORS.length]
      };
      return acc;
    }, {})
  };

  return (
    <div className="w-full max-w-5xl">
      <h2 className="text-2xl font-bold mb-6">Spending Insights</h2>
      
      {/* Budget Status Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Monthly Budget Status</CardTitle>
          <CardDescription>Current month spending vs your income</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-md">
              <p className="text-sm text-muted-foreground">Monthly Income</p>
              <p className="text-2xl font-bold">${pay}</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-md">
              <p className="text-sm text-muted-foreground">Spent So Far</p>
              <p className="text-2xl font-bold text-red-500">${budgetStatus.totalSpent.toFixed(2)}</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-md">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className={`text-2xl font-bold ${budgetStatus.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${budgetStatus.remaining.toFixed(2)}
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Budget Usage</span>
              <span className="text-sm">{budgetStatus.percentageSpent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  budgetStatus.percentageSpent > 90 ? 'bg-red-600' : 
                  budgetStatus.percentageSpent > 70 ? 'bg-yellow-500' : 'bg-green-600'
                }`}
                style={{ width: `${Math.min(budgetStatus.percentageSpent, 100)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Spending by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Where your money is going</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {categoryTotals.length > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryTotals}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, value}) => `${name}: $${value}`}
                    >
                      {categoryTotals.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-center py-10">No expense data available</p>
            )}
          </CardContent>
        </Card>
        
        {/* Monthly Spending Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trends</CardTitle>
            <CardDescription>Spending patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlySpending.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlySpending}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Spent']} />
                  <Legend />
                  <Bar dataKey="amount" name="Spending" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-10">No expense data available</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Category Breakdown List */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>Detailed view of your spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryTotals.length > 0 ? (
              categoryTotals.map((category, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: category.fill }}></div>
                    <span>{category.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">${category.value.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({((category.value / budgetStatus.totalSpent) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No expense data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}