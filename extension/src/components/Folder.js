/*global chrome*/

import React, { useState } from "react";
import { BookmarkNode, FAVICON_URL, ItemTypes, ROOT_ID } from "../utils/types";

// Materical icons
import FolderIcon from "@mui/icons-material/Folder";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OutboxIcon from "@mui/icons-material/Outbox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/CropSquare";

import Modal from "./utility-components/Modal";
import "../styles/Folder.css";
import { convertFolderToGroup, deleteBookmarkNodes, getBookmarkNodes } from "../utils/functions";
import Dropdown from "./utility-components/Dropdown";
import { useDrag } from "react-dnd";

const Folder = ({ folder, moveItemsOut, convertContainer }) => {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [folderOptionsOpen, setFolderOptionsOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FOLDER,
    item: folder,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleMoveAllItemsOut = () => {
    // Move items out on the backend
    moveItemsOut(children);

    // Clear the current children list
    setChildren([]);
  };

  const handleMoveChildOut = (item) => {
    // Move item out on the backend
    moveItemsOut([item]);

    // Remove from the children list
    setChildren((curChildren) => curChildren.filter((child) => child.id != item.id));
  };

  /**
   * Opens the primary folder menu in a modal
   *
   * Triggered by clicking the folder icon from the home screen icon
   */
  const openFolderModal = () => {
    setOpen(true);
    getChildren(folder.id);
  };

  const getChildren = async (folderId) => {
    const newChildren = await getBookmarkNodes((bookmark) => bookmark.parentId === folderId);
    newChildren.sort((item1, item2) => item1.index - item2.index);
    console.log("Got", newChildren);
    setChildren(newChildren);
  };

  /**
   * Resets the breadcrumb list and opens the original folder.
   */
  const resetBreadcrumbs = () => {
    // Early return if already showing the root folder items
    if (children && folder.id === children[0]?.parentId) {
      return;
    }

    setBreadcrumbs([]);
    getChildren(folder.id);
  };

  /**
   * Truncates the breadcrumb list and updates the children.
   *
   * @param {BookmarkNode} breadcrumb - The breadcrumb that was clicked
   */
  const onBreadcrumbClick = (breadcrumb) => {
    // Early return if already showing the selected breadcrumb items
    if (children && breadcrumb.id === children[0]?.parentId) {
      return;
    }

    const index = breadcrumbs.indexOf(breadcrumb);
    console.debug("Truncating breadcrumbs to", index);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    getChildren(breadcrumb.id);
  };

  /**
   * Opens the list item within the folder menu.
   *
   * The list item may be another folder or a bookmark
   *
   * @param {BookmarkNode} item - The list item that was selected
   */
  const openListItem = (item) => {
    switch (item.type) {
      case ItemTypes.BOOKMARK:
        // If bookmark, opens the URL in a new tab
        window.open(item.url, "_blank");
        break;
      case ItemTypes.FOLDER:
        // If folder, displays the contents
        getChildren(item.id);
        setBreadcrumbs((oldBreadcrumbs) => oldBreadcrumbs.concat(item));
        break;
      default:
        console.warn(`Item type '${item.type}' not recognized!`);
        break;
    }
  };

  const getCurrentFolder = () => {
    if (!breadcrumbs.length) {
      return folder;
    }

    return breadcrumbs[breadcrumbs.length - 1];
  };

  /**
   *
   * @param {string[]} itemIds
   */
  const deleteItems = (itemIds) => {
    console.debug(`About to deleting items: ${itemIds}`);
    deleteBookmarkNodes(itemIds).then(() => {
      // Update the children
      const updatedChildren = children.filter((child) => !itemIds.includes(child.id));
      setChildren(updatedChildren);
    });
  };

  const deleteCurrentFolder = () => {
    const currentFolder = getCurrentFolder();
    console.debug(`About to delete ${currentFolder.id} (${currentFolder.title})`);

    deleteBookmarkNodes([currentFolder.id]).then(() => {
      // If the top-level folder is deleted, close the modal
      if (currentFolder.parentId == ROOT_ID) {
        console.debug("Deleting the top-level folder, closing modal");
        setOpen(false);
        return;
      }

      // Otherwise update the breadcrumbs (and children)
      setBreadcrumbs(breadcrumbs.slice(0, breadcrumbs.length - 1));
      getChildren(currentFolder.parentId);
    });
  };

  const convertToGroup = () => {
    const currentFolder = getCurrentFolder();
    console.debug(`Converting "${currentFolder.title}" to group`);
    convertContainer(currentFolder.id, currentFolder.type).then(() => setOpen(false));
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="Folder-menu shadow">
          <span className="Folder-menu-header">
            <nav>
              <span className="Folder-menu-breadcrumb">
                <button onClick={resetBreadcrumbs} title={`Open ${folder.title}`}>
                  {folder.title}
                </button>
              </span>
              {breadcrumbs.map((breadcrumb) => (
                <span className="Folder-menu-breadcrumb" key={breadcrumb.id}>
                  <ArrowRightIcon />
                  <button
                    title={`Open ${breadcrumb.title}`}
                    onClick={() => onBreadcrumbClick(breadcrumb)}
                  >
                    {breadcrumb.title}
                  </button>
                </span>
              ))}
            </nav>
            <Dropdown buttonIcon={<MoreVertIcon />}>
              <button id="move-all-out" onClick={handleMoveAllItemsOut}>
                <OutboxIcon />
                <label htmlFor="move-all-out">Move all folder contents out</label>
              </button>
              <button id="delete-folder" onClick={deleteCurrentFolder}>
                <DeleteIcon />
                <label htmlFor="delete-folder">Delete folder</label>
              </button>
              <button id="convert-to-group" onClick={convertToGroup}>
                <GroupIcon />
                <label htmlFor="convert-to-group">Convert to Group</label>
              </button>
            </Dropdown>
          </span>
          <ul className="Folder-menu-item-list">
            {children?.map((item) => {
              return (
                <li
                  key={item.id}
                  className="Folder-menu-item"
                  id={item.title}
                  onDoubleClick={() => openListItem(item)}
                >
                  <span className="Folder-menu-item-content">
                    {item.type === ItemTypes.FOLDER ? (
                      <FolderIcon />
                    ) : (
                      <img src={`${FAVICON_URL}${item.url}`} alt="" />
                    )}
                    <label
                      className={item.type === ItemTypes.FOLDER ? "" : "Folder-menu-item-title"}
                      htmlFor={`#${item.title}`}
                    >
                      {item.title}
                    </label>
                    <label className="Folder-menu-item-url" htmlFor={`#${item.title}`}>
                      {item.url}
                    </label>
                  </span>
                  <Dropdown buttonIcon={<MoreVertIcon />}>
                    <button id="move-out" onClick={() => handleMoveChildOut(item)}>
                      <OutboxIcon />
                      <label htmlFor="move-out">Move {item.type} out</label>
                    </button>
                    <button id="edit">
                      <EditIcon />
                      <label htmlFor="edit">Edit {item.type}</label>
                    </button>
                    <button id="delete" onClick={() => deleteItems([item.id])}>
                      <DeleteIcon />
                      <label htmlFor="delete">Delete {item.type}</label>
                    </button>
                  </Dropdown>
                </li>
              );
            })}
          </ul>
        </div>
      </Modal>
      <button ref={drag} className="grid-item" onClick={openFolderModal}>
        <div className={`grid-item-container ${isDragging ? "wiggle" : ""}`}>
          <FolderIcon style={{ width: "inherit", height: "inherit" }} />
        </div>
        <span className="grid-item-label">{folder.title}</span>
      </button>
    </>
  );
};

export default Folder;
