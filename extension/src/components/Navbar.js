import React, { useState } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Dropdown from "./utility-components/Dropdown";
import MenuIcon from "@mui/icons-material/Menu";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SettingsIcon from "@mui/icons-material/Settings";

import "../styles/Navbar.css";
import Modal from "./utility-components/Modal";
import NewItemForm from "./utility-components/NewItemForm";
import { FORMS, ItemTypes } from "../utils/types";
import Settings from "./Settings";

const Navbar = ({ page, onPreviousPage, onNextPage, createNewItem }) => {
  const [openModal, setOpenModal] = useState(null);
  const [formData, setFormData] = useState({});

  /**
   * Updates the form data for the navbar forms
   *
   * @param {object} newData
   */
  const updateFormData = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const openForm = (itemType) => {
    setFormData({});
    setOpenModal(itemType);
  };

  const clearAndCloseForm = () => {
    setFormData({});
    setOpenModal(null);
  };

  const handleSubmitForm = () => {
    switch (openModal) {
      case ItemTypes.BOOKMARK:
        const bookmarkData = {
          title: formData[FORMS.newBookmark.name],
          type: ItemTypes.BOOKMARK,
          url: formData[FORMS.newBookmark.url],
        };
        createNewItem(bookmarkData).then(clearAndCloseForm);
        break;
      case ItemTypes.GROUP:
        const groupData = {
          title: formData[FORMS.newGroup.name],
          type: ItemTypes.GROUP,
          children: [],
        };
        createNewItem(groupData).then(clearAndCloseForm);
        break;
      case ItemTypes.FOLDER:
        const folderData = {
          title: formData[FORMS.newFolder.name],
          type: ItemTypes.FOLDER,
          children: [],
        };
        createNewItem(folderData).then(clearAndCloseForm);
        break;
      default:
        console.warn("Not a valid item type, could not create");
        setOpenModal(null);
        break;
    }
  };

  return (
    <>
      <Modal open={openModal === "settings"} onClose={() => setOpenModal(null)}>
        <Settings />
      </Modal>
      <Modal open={openModal === "bookmark"} onClose={() => setOpenModal(null)}>
        <NewItemForm
          onSubmit={handleSubmitForm}
          itemType={ItemTypes.BOOKMARK}
          formData={formData}
          onUpdate={updateFormData}
        >
          <div className="form-item">
            <label htmlFor={FORMS.newBookmark.name}>Bookmark name</label>
            <input
              className="text-input"
              id={FORMS.newBookmark.name}
              type="text"
              value={formData[FORMS.newBookmark.name] || ""}
              onChange={(e) => updateFormData({ [FORMS.newBookmark.name]: e.target.value })}
              autoFocus
            />
          </div>
          <div className="form-item">
            <label htmlFor={FORMS.newBookmark.url}>URL</label>
            <input
              className="text-input"
              id={FORMS.newBookmark.url}
              type="text"
              value={formData[FORMS.newBookmark.url] || ""}
              onChange={(e) => updateFormData({ [FORMS.newBookmark.url]: e.target.value })}
            />
          </div>
        </NewItemForm>
      </Modal>
      <Modal open={openModal === "group"} onClose={() => setOpenModal(null)}>
        <NewItemForm
          onSubmit={handleSubmitForm}
          itemType={ItemTypes.GROUP}
          formData={formData}
          onUpdate={updateFormData}
        >
          <div className="form-item">
            <label htmlFor={FORMS.newGroup.name}>Group name</label>
            <input
              className="text-input"
              id={FORMS.newGroup.name}
              type="text"
              value={formData[FORMS.newGroup.name] || ""}
              onChange={(e) => updateFormData({ [FORMS.newGroup.name]: e.target.value })}
              autoFocus
            />
          </div>
        </NewItemForm>
      </Modal>
      <Modal open={openModal === "folder"} onClose={() => setOpenModal(null)}>
        <NewItemForm
          onSubmit={handleSubmitForm}
          itemType={ItemTypes.FOLDER}
          formData={formData}
          onUpdate={updateFormData}
        >
          <div className="form-item">
            <label htmlFor={FORMS.newFolder.name}>Folder name</label>
            <input
              className="text-input"
              id={FORMS.newFolder.name}
              type="text"
              value={formData[FORMS.newFolder.name] || ""}
              onChange={(e) => updateFormData({ [FORMS.newFolder.name]: e.target.value })}
              autoFocus
            />
          </div>
        </NewItemForm>
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
