import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryList from "@/components/form/CategoryList";
import useDataStore from "@/hooks/useDataStore";
import PayMenu from "@/components/overview/PayMenu";
import GoalList from "@/components/goal/GoalList";
import SpendingInfo from "@/components/overview/SpendingInfo.jsx";
import SavingsTracker from "@/components/overview/SavingsTracker.jsx";
import BudgetPlanner from "@/components/overview/BudgetPlanner.jsx";

export default function OverviewPage() {
  const { pay } = useDataStore();
  
  return (
    <div className="flex flex-col items-center gap-y-8 h-full w-full max-w-6xl mx-auto px-4 pb-16 ">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 p-6 rounded-lg">
        <div>
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-muted-foreground">Manage your finances in one place</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Monthly Income</p>
            <p className="text-xl font-bold">${pay}</p>
          </div>
          <PayMenu />
        </div>
      </div>
      
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="budget">Budget Planner</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="flex justify-center">
          <SpendingInfo />
        </TabsContent>
        
        <TabsContent value="budget" className="flex justify-center">
          <BudgetPlanner />
        </TabsContent>
        
        <TabsContent value="savings" className="flex justify-center">
          <SavingsTracker />
        </TabsContent>
        
        <TabsContent value="goals" className="flex justify-center">
          <div className="w-full max-w-5xl">
            <h2 className="text-2xl font-bold mb-6">Savings Goals</h2>
            <GoalList />
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="flex justify-center">
          <div className="w-full max-w-5xl">
            <h2 className="text-2xl font-bold mb-6">Spending Categories</h2>
            <CategoryList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}