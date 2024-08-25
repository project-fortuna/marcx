import React, { useEffect, useRef, useState } from "react";
import "../../styles/Dropdown.css";

const Dropdown = ({ children, buttonIcon, dropup, isContextMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownMenu = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownMenu.current && !dropdownMenu.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="Dropdown-container">
      {/* Context menus do not contain a toggle, they are basic dropdowns */}
      {!isContextMenu && (
        <button
          className="Dropdown-toggle-button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
          }}
        >
          {buttonIcon}
        </button>
      )}
      {(isOpen || isContextMenu) && (
        <ul
          onClick={() => setIsOpen(false)}
          ref={dropdownMenu}
          className="Dropdown-list shadow"
          style={{
            bottom: dropup ? "100%" : "auto",
            top: !dropup && !isContextMenu ? "100%" : "auto",
            position: isContextMenu ? "relative" : "absolute",
          }}
        >
          {children}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
