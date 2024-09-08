// External imports
import React, { useState } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Dropdown from "./utility-components/Dropdown";
import MenuIcon from "@mui/icons-material/Menu";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SettingsIcon from "@mui/icons-material/Settings";

// Local imports
import "../styles/Navbar.css";
import Settings from "./Settings";
import Modal from "./utility-components/Modal";
import { FormTypes } from "../utils/types";
import { useDispatch } from "react-redux";
import { openModal } from "../app/slices/modal";

const Navbar = ({ page, onPreviousPage, onNextPage }) => {
  const [openSettingsModal, setOpenSettingsModal] = useState(null);

  const dispatch = useDispatch();

  const openForm = (itemType) => {
    setOpenSettingsModal(itemType);
  };

  const openNewItemForm = (formType) => {
    dispatch(openModal({ type: formType }));
  };

  return (
    <>
      <Modal open={openSettingsModal === "settings"} onClose={() => setOpenSettingsModal(null)}>
        <Settings />
      </Modal>
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
          <Dropdown buttonIcon={<MenuIcon />}>
            <button onClick={() => openNewItemForm(FormTypes.NEW_BOOKMARK)}>
              <BookmarkAddIcon />
              <label htmlFor="">New Bookmark</label>
            </button>
            <button onClick={() => openNewItemForm(FormTypes.NEW_GROUP)}>
              <AddBoxIcon />
              <label htmlFor="">New Group</label>
            </button>
            <button onClick={() => openNewItemForm(FormTypes.NEW_FOLDER)}>
              <CreateNewFolderIcon />
              <label htmlFor="">New Folder</label>
            </button>
            <button onClick={() => openForm("settings")}>
              <SettingsIcon />
              <label htmlFor="">Settings</label>
            </button>
          </Dropdown>
        </span>
      </nav>
    </>
  );
};

export default Navbar;
