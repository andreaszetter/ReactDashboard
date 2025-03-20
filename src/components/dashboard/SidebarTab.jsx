import { NavLink } from "react-router";

export default function SidebarTab({ link, text, icon }) {
  return (
    <NavLink
      to={link}
      className="flex items-center gap-x-2 transition-all duration-300 ease hover:opacity-50 aria-[current=page]:opacity-50"

    >
      {icon}
      <p className="text-xl font-semibold"> {text}</p>
    </NavLink>
  );
}
