import React from "react";
import "../../styles/NewItemForm.css";

const NewItemForm = ({ itemType, children, onSubmit }) => {
  return (
    <form
      className="standard-modal-container NewItemForm shadow"
      onSubmit={(e) => {
        e.preventDefault();
        console.debug(e);
        onSubmit(e);
      }}
    >
      <h1>Create new {itemType}</h1>
      {children}
      <button className="primary-button">Create {itemType}</button>
    </form>
  );
};

export default NewItemForm;
