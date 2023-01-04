import React from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

import "../styles/Navbar.css";

const Navbar = ({ page, onPreviousPage, onNextPage }) => {
  return (
    <nav>
      <span className="Navabar-page-nav">
        <button disabled={page === 0} onClick={onPreviousPage}>
          <ArrowLeftIcon />
        </button>
        <button onClick={onNextPage}>
          <ArrowRightIcon />
        </button>
      </span>
      <h2>Page {page + 1}</h2>
      <span className="Navbar-actions">
        <button>Edit mode</button>
        <button>Menu</button>
      </span>
    </nav>
  );
};

export default Navbar;
