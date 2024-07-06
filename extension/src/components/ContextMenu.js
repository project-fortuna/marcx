import React from "react";
import "../styles/ContextMenu.css";
import Dropdown from "./utility-components/Dropdown";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import AddBoxIcon from "@mui/icons-material/AddBox";

const ContextMenu = ({ isOpen, x, y }) => {
  return (
    <div className="ContextMenu-container" style={{ top: `${y}px`, left: `${x}px` }}>
      <Dropdown isContextMenu>
        <button onClick={() => openForm("bookmark")}>
          <BookmarkAddIcon />
          <label htmlFor="">New Bookmark</label>
        </button>
        <button onClick={() => openForm("group")}>
          <AddBoxIcon />
          <label htmlFor="">New Group</label>
        </button>
        <button onClick={() => openForm("folder")}>
          <CreateNewFolderIcon />
          <label htmlFor="">New Folder</label>
        </button>
      </Dropdown>
    </div>
  );
};

export default ContextMenu;
