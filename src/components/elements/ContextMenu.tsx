import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";

type Command = {
  label: string;
  icon?: string;
  onClick?: () => void;
  submenu?: Command[];
};

type ContextMenuProps = {
  commands: Command[];
  children: React.ReactNode; // The component it wraps (e.g., Container)
};

const ContextMenu: React.FC<ContextMenuProps> = ({ commands, children }) => {
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
    visible: boolean;
  }>({ x: 0, y: 0, visible: false });

  const menuRef = useRef<HTMLDivElement>(null);

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuPosition({
      x: event.clientX,
      y: event.clientY,
      visible: true,
    });
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      menuPosition.visible
    ) {
      setMenuPosition({ ...menuPosition, visible: false });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuPosition.visible]);

  const closeMenu = () => setMenuPosition({ ...menuPosition, visible: false });

  return (
    <div onContextMenu={handleRightClick} className="relative">
      {children}
      {menuPosition.visible &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: menuPosition.y,
              left: menuPosition.x,
              zIndex: 200,
            }}
            className="bg-white/90 dark:bg-muted-950/90 text-sm shadow-lg rounded-tl-none rounded-lg p-1"
          >
            <ul className="list-none m-0 p-0">
              {commands.map((command, index) => (
                <li
                  key={index}
                  className="cursor-pointer p-2 hover:bg-muted-100 dark:hover:bg-muted-700 flex items-center rounded-md text-muted-700 dark:text-muted-300"
                  onClick={() => {
                    command.onClick?.();
                    closeMenu();
                  }}
                >
                  {command.icon && (
                    <Icon
                      icon={command.icon}
                      className="mr-2 w-5 h-5 text-muted-500 dark:text-muted-300"
                    />
                  )}
                  {command.label}
                </li>
              ))}
            </ul>
          </div>,
          document.body // Render menu in a portal
        )}
    </div>
  );
};

export default ContextMenu;
