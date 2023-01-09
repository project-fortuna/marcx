import React, { useState } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Dropdown from "./utility-components/Dropdown";
import MenuIcon from "@mui/icons-material/Menu";

import "../styles/Navbar.css";
import Modal from "./utility-components/Modal";
import NewItemForm from "./utility-components/NewItemForm";
import { FORMS, ItemTypes } from "../utils/types";

const Navbar = ({ page, onPreviousPage, onNextPage, createNewGroup }) => {
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

  const handleSubmitForm = () => {
    createNewGroup(formData);

    setOpenModal(null);
  };

  return (
    <>
      <Modal open={openModal === "group"} onClose={() => setOpenModal(null)}>
        <NewItemForm
          onSubmit={handleSubmitForm}
          itemType={ItemTypes.GROUP}
          formData={formData}
          onUpdate={updateFormData}
        >
          <label htmlFor={FORMS.newGroup.name}>Group name</label>
          <input
            className="text-input"
            id={FORMS.newGroup.name}
            type="text"
            value={formData.groupName || ""}
            onChange={(e) => updateFormData({ [FORMS.newGroup.name]: e.target.value })}
          />
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
          <button>Edit mode</button>
          <Dropdown buttonIcon={<MenuIcon />}>
            <button onClick={() => setOpenModal("group")}>New Bookmark</button>
            <button onClick={() => setOpenModal("group")}>New Group</button>
            <button onClick={() => setOpenModal("group")}>New Folder</button>
            <button onClick={() => setOpenModal("group")}>Settings</button>
          </Dropdown>
        </span>
      </nav>
    </>
  );
};

export default Navbar;
