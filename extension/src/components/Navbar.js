import React from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Dropdown from "./utility-components/Dropdown";
import MenuIcon from "@mui/icons-material/Menu";

import "../styles/Navbar.css";

const Navbar = ({ page, onPreviousPage, onNextPage }) => {
  return (
    <nav className="Navbar">
      <span className="Navbar-page-nav">
        <button disabled={page === 0} onClick={onPreviousPage} title="Previous page">
          <ArrowLeftIcon />
        </button>
        <button onClick={onNextPage} title="Next page">
          <ArrowRightIcon />
        </button>
      </span>
      <h2>Page {page + 1}</h2>
      <span className="Navbar-actions">
        <button>Edit mode</button>
        <Dropdown buttonIcon={<MenuIcon />}>
          <button>New Bookmark</button>
          <button>New Group</button>
          <button>New Folder</button>
          <button>Settings</button>
        </Dropdown>
      </span>
    </nav>
  );
};

export default Navbar;
