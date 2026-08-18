import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import ArrowRightIcon from "@mui/icons-material/East";
import type { MenuItemType } from "../../types";

interface SubMenuProps {
  item: MenuItemType;
  isSidebarOpen: boolean;
  isOpen: boolean;
  isHovered?: boolean;
  anchorRef?: React.RefObject<HTMLDivElement | null>;
  onPopoverMouseEnter?: () => void;
  onPopoverMouseLeave?: () => void;
}

const SubMenu = ({
  item,
  isSidebarOpen,
  isOpen,
  isHovered,
  anchorRef,
  onPopoverMouseEnter,
  onPopoverMouseLeave,
}: SubMenuProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const isPopoverVisible = !isSidebarOpen && isHovered;

  useEffect(() => {
    if (isPopoverVisible && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPopoverPos({
        top: rect.top,
        left: rect.right + 8,
      });
    }
  }, [isPopoverVisible, anchorRef]);

  // Expanded sidebar: inline dropdown
  if (isSidebarOpen) {
    return (
      <div
        className={clsx(
          "overflow-hidden transition-all duration-300 ease-in-out pl-9 space-y-1 mt-1",
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {item.subItems?.map((sub, idx) => {
          const isSubActive = sub.href === currentPath;
          return (
            <Link
              key={idx}
              to={sub.href}
              className={clsx(
                "block py-2 px-3 text-sm rounded-lg transition-all whitespace-nowrap",
                isSubActive
                  ? "text-primary font-semibold bg-primary/5"
                  : "text-secondary-txt hover:text-primary hover:bg-primary/5",
              )}
            >
              {sub.label}
            </Link>
          );
        })}
      </div>
    );
  }

  // Collapsed sidebar: floating popover via portal
  if (!isPopoverVisible) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: popoverPos.top,
        left: popoverPos.left,
        zIndex: 9999,
      }}
      onMouseEnter={onPopoverMouseEnter}
      onMouseLeave={onPopoverMouseLeave}
      className={clsx(
        "p-4 rounded-xl min-w-[200px] shadow-xl border space-y-2.5",
        "bg-theme-primary border-light-dark",
      )}
    >
      <p className="text-xs font-bold px-2 uppercase tracking-wider mb-1 text-secondary-txt/70">
        {item.label}
      </p>

      {item.subItems?.map((sub, idx) => {
        const isSubActive = sub.href === currentPath;
        return (
          <Link
            key={idx}
            to={sub.href}
            className={clsx(
              "flex items-center gap-2 py-2 px-2.5 text-sm rounded-lg transition-all whitespace-nowrap group/sub",
              isSubActive
                ? "text-primary font-semibold bg-primary/5"
                : "text-secondary-txt hover:text-primary hover:bg-primary/5",
            )}
          >
            <ArrowRightIcon className="text-[14px] opacity-70 transition-transform group-hover/sub:translate-x-0.5" />
            {sub.label}
          </Link>
        );
      })}
    </div>,
    document.body,
  );
};

export default SubMenu;
