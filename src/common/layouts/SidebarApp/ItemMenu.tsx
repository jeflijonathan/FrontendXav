import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import ChevronDownIcon from "@mui/icons-material/KeyboardArrowDown";
import useSidebarStore from "../../store/useSidebarStore";
import type { MenuItemType } from "../../types";
import SubMenu from "./SubMenu";

interface ItemMenuProps {
  item: MenuItemType;
}

const ItemMenu = ({ item }: ItemMenuProps) => {
  const { isSidebarOpen } = useSidebarStore();
  const location = useLocation();
  const currentPath = location.pathname;
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isParentActive = item.href === currentPath;
  const isAnySubItemActive = hasSubItems
    ? item.subItems!.some((sub) => sub.href === currentPath)
    : false;
  const isActive = isParentActive || isAnySubItemActive;
  const [isOpen, setIsOpen] = useState(isAnySubItemActive);
  const [isHovered, setIsHovered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hideTimerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  // Dipanggil dari SubMenu saat mouse masuk/keluar popover
  const handlePopoverMouseEnter = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setIsHovered(true);
  };

  const handlePopoverMouseLeave = () => {
    hideTimerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    if (hasSubItems && isSidebarOpen) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="w-full relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={item.href || "#"}
        onClick={toggleDropdown}
        className={clsx(
          "flex items-center justify-between px-3 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap cursor-pointer",
         isActive
            ? "bg-primary text-theme-primary shadow-lg shadow-primary/20"
            : "text-secondary-txt hover:bg-primary/10 hover:text-primary",
        )}
      >
        <div className="flex items-center gap-3.5">
          <span className="inline-flex items-center shrink-0 transition-transform group-hover:scale-105">
            {item.icon}
          </span>
          {isSidebarOpen && <span className="text-sm">{item.label}</span>}
        </div>

        {hasSubItems && isSidebarOpen && (
          <ChevronDownIcon
            fontSize="small"
            className={clsx(
              "transition-transform duration-200",
              "text-secondary-txt/70",
              isOpen && "rotate-180",
            )}
          />
        )}
      </Link>

      {hasSubItems && (
        <SubMenu
          item={item}
          isSidebarOpen={isSidebarOpen}
          isOpen={isOpen}
          isHovered={isHovered}
          anchorRef={wrapperRef}
          onPopoverMouseEnter={handlePopoverMouseEnter}
          onPopoverMouseLeave={handlePopoverMouseLeave}
        />
      )}
    </div>
  );
};

export default ItemMenu;
