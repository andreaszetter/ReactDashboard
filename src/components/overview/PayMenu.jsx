import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { useState } from "react"
import useDataStore from "@/hooks/useDataStore"

export default function PayMenu(){
    const { pay, updatePay } = useDataStore();
    const [inputValue, setInputValue] = useState(pay || "1000");
    
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    
    const handleSubmit = () => {
        // Convert to number and make pay = inputValue
        updatePay(Number(inputValue));
    };

    return(
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Enter monthly salary</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Monthly salary</h4>
            <p className="text-sm text-muted-foreground">
              Set your monthly salary for the page.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="pay">Salary</Label>
              <Input
                id="pay"
                value={inputValue}
                onChange={handleInputChange}
                className="col-span-2 h-8"
              />
            </div>
            <Button onClick={handleSubmit} className="mt-2">Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>)
}