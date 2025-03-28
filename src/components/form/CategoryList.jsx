import useDataStore from "@/hooks/useDataStore"
import CategoryCard from "./CategoryCard";

export default function CategoryList(){
    const {categories} = useDataStore();
    

    return(
    <div className="flex-row flex max-w-3xl flex-wrap">
        {categories.map((category) => {
          return <CategoryCard category={category} key={category.id}/>
        })}
    </div>)
}