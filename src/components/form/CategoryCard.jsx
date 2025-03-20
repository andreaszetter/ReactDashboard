import {
    Card,
    CardContent,
    CardFooter,
    CardTitle,
  } from "@/components/ui/card"
import useDataStore from "@/hooks/useDataStore"
import useEditStore from "@/hooks/useEditStore";
  
  export default function CategoryCard({category}){
    const {deleteCategory} = useDataStore();
    const {updateEditingCategory} = useEditStore();
    const {expenses} = useDataStore();

    const categoryExpenses = expenses.filter((exp) => exp.spendingCategory === category.category);
    let categoryTotalSpent = 0;

    if(categoryExpenses.length > 0){
    categoryExpenses.forEach((exp) => {
      categoryTotalSpent += exp.totalAmount;
    })
  }
    
    return( 
    <div className="min-w-24 max-w-32 h-min border-black border-2 rounded-lg flex flex-col items-center">
        <Card className="w-full flex flex-col p-1">
            <div className="h-2 rounded-xl mx-1 mt-1" style={{backgroundColor:category.color}}>
            </div>
            <CardContent className="mt-1 p-0 pb-1">
                <CardTitle className="text-slate-800 text-2xl font-semibold">{category.category}</CardTitle>
                <p className="text-xl">${categoryTotalSpent}</p>
            </CardContent>
            <CardFooter className="p-0">
                <button className="bg-slate-300 px-2 text-xs py-0 my-0 rounded-md" onClick={()=>updateEditingCategory(category)}>Edit</button>
                <button className="bg-red-500 px-2 text-xs py-0 my-0 rounded-md" onClick={()=>deleteCategory(category.id)} >Delete</button>
            </CardFooter>

    </Card>
    </div>
    
    )
}