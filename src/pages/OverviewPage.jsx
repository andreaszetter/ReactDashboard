import { Button } from "@/components/ui/button";
import { PieChartCard } from "../components/statistics/PieChartCard";
import { BarChartInteractive } from "../components/statistics/BarChartInteractive";
import {CategoryList} from "@/components/form/CategoryList";
import {useDataStore} from "@/hooks/useDataStore";
import {PayMenu} from "@/components/overview/PayMenu";

export default function OverviewPage() {

  const {pay} = useDataStore();
  return (
    <div className="flex flex-col justify-center items-center gap-y-10 h-full">
      <h1 className="text-4xl">React Dashboard</h1>
      <div className="items-center flex flex-col">
        <h2>Current monthly salary : </h2>
        <p>${pay}</p>
        
      </div>
      <PayMenu />
      <CategoryList/>
      <Button>Click me</Button>
      
    </div>
  );
}
