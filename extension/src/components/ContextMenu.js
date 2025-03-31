import React from "react";
import "../styles/ContextMenu.css";
import Dropdown from "./utility-components/Dropdown";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useDispatch } from "react-redux";
import { openModal } from "../app/slices/modal";
import { FormTypes, BookmarkNode, ItemTypes } from "../utils/types";
import { useItemDeleter } from "../utils/hooks";
import { setEditItemId } from "../app/slices/topLevelItems";

/**
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {BookmarkNode} props.contextItem - The item that was clicked on to open the context menu
 * @returns
 */
const ContextMenu = ({ isOpen, x, y, onClick, contextItem }) => {
  const dispatch = useDispatch();

  const openForm = (formType) => {
    dispatch(openModal({ type: formType, context: { item: contextItem } }));
  };

  const deleteItems = useItemDeleter();

  return (
    <div
      className="ContextMenu-container"
      style={{ top: `${y}px`, left: `${x}px` }}
      onClick={onClick}
    >
      <Dropdown isContextMenu>
        {contextItem.type === ItemTypes.EMPTY ? (
          // Create a new node
          <>
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
            </button>{" "}
          </>
        ) : (
          // Modify an existing node
          <>
            {/* TODO: Add confirmation modal */}
            <button onClick={() => deleteItems([contextItem.id])}>
              <DeleteIcon />
              <label htmlFor="">Delete {contextItem.type}</label>
            </button>

            {/* Edit action */}
            <button
              onClick={() => {
                console.log("Edit", contextItem.type);
                dispatch(setEditItemId(contextItem.id));
              }}
            >
              <EditIcon />
              <label htmlFor="">
                {contextItem.type === ItemTypes.BOOKMARK ? "Edit" : "Rename"} {contextItem.type}
              </label>
            </button>
          </>
        )}
      </Dropdown>
    </div>
  );
};

export default ContextMenu;
