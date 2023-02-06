import React, { useEffect, useRef, useState } from "react";
import "../../styles/Dropdown.css";

const Dropdown = ({ children, buttonIcon, dropup }) => {
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
      {isOpen && (
        <ul
          onClick={() => setIsOpen(false)}
          ref={dropdownMenu}
          className="Dropdown-list shadow"
          style={dropup ? { bottom: "100%" } : { top: "100%" }}
        >
          {children}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
