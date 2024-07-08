import React from "react";
import "../styles/ContextMenu.css";
import Dropdown from "./utility-components/Dropdown";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useDispatch } from "react-redux";
import { openModal } from "../app/slices/modal";
import { FormTypes } from "../utils/types";

const ContextMenu = ({ isOpen, x, y, onClick }) => {
  const dispatch = useDispatch();

  const openForm = (formType) => {
    dispatch(openModal({ type: formType }));
  };

  return (
    <div
      className="ContextMenu-container"
      style={{ top: `${y}px`, left: `${x}px` }}
      onClick={onClick}
    >
      <Dropdown isContextMenu>
        <button onClick={() => openForm(FormTypes.NEW_BOOKMARK)}>
          <BookmarkAddIcon />
          <label htmlFor="">New Bookmark</label>
        </button>
        <button onClick={() => openForm(FormTypes.NEW_GROUP)}>
          <AddBoxIcon />
          <label htmlFor="">New Group</label>
        </button>
        <button onClick={() => openForm(FormTypes.NEW_FOLDER)}>
          <CreateNewFolderIcon />
          <label htmlFor="">New Folder</label>
        </button>
      </Dropdown>
    </div>
  );
};

export default ContextMenu;
