import { Button } from "@/components/ui/button";
import { PieChartCard } from "../components/statistics/PieChartCard";
import { BarChartInteractive } from "../components/statistics/BarChartInteractive";
import CategoryList from "@/components/form/CategoryList";

export default function OverviewPage() {

  
  return (
    <div className="flex flex-col justify-center items-center gap-y-10 h-full">
      <h1 className="text-4xl">React Dashboard</h1>
      <CategoryList/>
      <Button>Click me</Button>
      <PieChartCard/>
      <BarChartInteractive/>
    </div>
  );
}
