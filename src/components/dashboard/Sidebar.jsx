import SidebarTab from "./SidebarTab";
import { GrOverview } from "react-icons/gr";
import { GoGoal } from "react-icons/go";
import { BiCategory } from "react-icons/bi";
import { LuHandCoins } from "react-icons/lu";

const LINKS = [
  {
    link: "/",
    text: "Overview",
    icon: <GrOverview size={24} />,
  },
  {
    link: "/spendings",
    text: "Spendings",
    icon: <LuHandCoins size={24} />,
  },
  {
    link: "/categories",
    text: "Categories",
    icon: <BiCategory size={24} />,
  },
  {
    link: "/goals",
    text: "Goals",
    icon: <GoGoal size={24} />,
  },
];

export default function Sidebar() {
  return (
    <nav className="flex  flex-col p-6 md:px-8 md:pt-12 w-full md:max-w-[250px] bg-slate-200 md:min-h-screen h-fit ">
      <ul className="flex items-center md:items-start md:flex-col gap-y-12 gap-x-4 pb-2 md:p-0 overflow-x-scroll md:overflow-x-auto">
        {LINKS.map((link, index) => {
          return (
            <SidebarTab
              key={link.link + index}
              link={link.link}
              text={link.text}
              icon={link.icon}
            />
          );
        })}
      </ul>
    </nav>
  );
}
