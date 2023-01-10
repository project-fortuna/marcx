/*global chrome*/

import React, { useState } from "react";
import { BookmarkNode, FAVICON_URL, ItemTypes } from "../utils/types";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OutboxIcon from "@mui/icons-material/Outbox";

import Modal from "./utility-components/Modal";
import "../styles/Folder.css";
import { getBookmarkNodes } from "../utils/functions";
import Dropdown from "./utility-components/Dropdown";
import { useDrag } from "react-dnd";

const Folder = ({ folder, moveItemsOut }) => {
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

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="Folder-menu">
          <span className="Folder-menu-header">
            <nav>
              <button
                className="Folder-menu-breadcrumb"
                onClick={resetBreadcrumbs}
                title={`Open ${folder.title}`}
              >
                {folder.title}
              </button>
              {breadcrumbs.map((breadcrumb) => (
                <>
                  <ArrowRightIcon />
                  <button
                    className="Folder-menu-breadcrumb"
                    title={`Open ${breadcrumb.title}`}
                    onClick={() => onBreadcrumbClick(breadcrumb)}
                  >
                    {breadcrumb.title}
                  </button>
                </>
              ))}
            </nav>
            <Dropdown buttonIcon={<MoreVertIcon />}>
              <button id="move-all-out" onClick={handleMoveAllItemsOut}>
                <OutboxIcon />
                <label htmlFor="move-all-out">Move all folder contents out</label>
              </button>
              <button>Other</button>
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
                    <button id="move-all-out" onClick={handleMoveAllItemsOut}>
                      <OutboxIcon />
                      <label htmlFor="move-all-out">Move all folder contents out</label>
                    </button>
                    <button>Other</button>
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
