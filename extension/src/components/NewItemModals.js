import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearFormData, closeModal, updateFormData } from "../app/slices/modal";
import { useNewItemCreator } from "../utils/hooks";
import { FORMS, FormTypes, ItemTypes } from "../utils/types";
import Modal from "./utility-components/Modal";
import NewItemForm from "./utility-components/NewItemForm";

const NewItemModals = () => {
  const modalData = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const formData = modalData.formData;

  const createNewItem = useNewItemCreator();

  const handleSubmitForm = () => {
    let itemData = {};
    switch (modalData.type) {
      case FormTypes.NEW_BOOKMARK:
        itemData = {
          title: formData[FORMS.newBookmark.name],
          type: ItemTypes.BOOKMARK,
          url: formData[FORMS.newBookmark.url],
        };
        break;
      case FormTypes.NEW_GROUP:
        itemData = {
          title: formData[FORMS.newGroup.name],
          type: ItemTypes.GROUP,
          children: [],
        };
        break;
      case FormTypes.NEW_FOLDER:
        itemData = {
          title: formData[FORMS.newFolder.name],
          type: ItemTypes.FOLDER,
          children: [],
        };
        break;
      default:
        console.warn("Not a valid item type, could not create");
        dispatch(closeModal());
        return;
    }

    // Create a new item
    createNewItem(itemData).then(() => {
      dispatch(clearFormData());
      dispatch(closeModal());
    });
  };

  const close = () => {
    dispatch(closeModal());
  };

  if (!modalData.isOpen) {
    return <></>;
  }

  return (
    <>
      <Modal open={modalData.type === "new-bookmark"} onClose={close}>
        <NewItemForm onSubmit={handleSubmitForm} itemType={ItemTypes.BOOKMARK} formData={formData}>
          <div className="form-item">
            <label htmlFor={FORMS.newBookmark.url}>URL</label>
            <input
              className="text-input"
              id={FORMS.newBookmark.url}
              type="text"
              value={formData[FORMS.newBookmark.url] || ""}
              onChange={(e) =>
                dispatch(updateFormData({ [FORMS.newBookmark.url]: e.target.value }))
              }
              autoFocus
            />
          </div>
          <div className="form-item">
            <label htmlFor={FORMS.newBookmark.name}>Bookmark name</label>
            <input
              className="text-input"
              id={FORMS.newBookmark.name}
              type="text"
              value={formData[FORMS.newBookmark.name] || ""}
              onChange={(e) =>
                dispatch(updateFormData({ [FORMS.newBookmark.name]: e.target.value }))
              }
            />
          </div>
        </NewItemForm>
      </Modal>
      <Modal open={modalData.type === "new-group"} onClose={close}>
        <NewItemForm onSubmit={handleSubmitForm} itemType={ItemTypes.GROUP} formData={formData}>
          <div className="form-item">
            <label htmlFor={FORMS.newGroup.name}>Group name</label>
            <input
              className="text-input"
              id={FORMS.newGroup.name}
              type="text"
              value={formData[FORMS.newGroup.name] || ""}
              onChange={(e) => dispatch(updateFormData({ [FORMS.newGroup.name]: e.target.value }))}
              autoFocus
            />
          </div>
        </NewItemForm>
      </Modal>
      <Modal open={modalData.type === "new-folder"} onClose={close}>
        <NewItemForm onSubmit={handleSubmitForm} itemType={ItemTypes.FOLDER} formData={formData}>
          <div className="form-item">
            <label htmlFor={FORMS.newFolder.name}>Folder name</label>
            <input
              className="text-input"
              id={FORMS.newFolder.name}
              type="text"
              value={formData[FORMS.newFolder.name] || ""}
              onChange={(e) => dispatch(updateFormData({ [FORMS.newFolder.name]: e.target.value }))}
              autoFocus
            />
          </div>
        </NewItemForm>
      </Modal>
    </>
  );
};

export default NewItemModals;
