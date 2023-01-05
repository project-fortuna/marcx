/*global chrome*/

import React, { useState } from "react";
import { BookmarkNode, FAVICON_URL } from "../utils/types";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OutboxIcon from "@mui/icons-material/Outbox";

import Modal from "./Modal";
import "../styles/Folder.css";
import { getBookmarkNodes } from "../utils/functions";
import Dropdown from "./utility-components/Dropdown";

const Folder = ({ folder, moveItemsOut }) => {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [folderOptionsOpen, setFolderOptionsOpen] = useState(false);

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
    if (children && folderId === children[0]?.parentId) {
      // Avoid repetitive calls if the correct children are already being
      // displayed
      return;
    }

    const newChildren = await getBookmarkNodes((bookmark) => bookmark.parentId === folderId);
    console.log("Got", newChildren);
    setChildren(newChildren);
  };

  /**
   * Resets the breadcrumb list and opens the original folder.
   */
  const resetBreadcrumbs = () => {
    setBreadcrumbs([]);
    getChildren(folder.id);
  };

  /**
   * Truncates the breadcrumb list and updates the children.
   *
   * @param {BookmarkNode} breadcrumb - The breadcrumb that was clicked
   */
  const onBreadcrumbClick = (breadcrumb) => {
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
      case "bookmark":
        // If bookmark, opens the URL in a new tab
        window.open(item.url, "_blank");
        break;
      case "folder":
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
              <h1 onClick={resetBreadcrumbs}>{folder.title}</h1>
              {breadcrumbs.map((breadcrumb) => (
                <>
                  <ArrowRightIcon />
                  <h2 onClick={() => onBreadcrumbClick(breadcrumb)}>{breadcrumb.title}</h2>
                </>
              ))}
            </nav>
            <Dropdown buttonIcon={<MoreVertIcon />}>
              <button
                id="move-all-out"
                onClick={() => moveItemsOut(children.map((child) => child.id))}
              >
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
                  <span>
                    {item.type === "folder" ? (
                      <FolderIcon />
                    ) : (
                      <img src={`${FAVICON_URL}${item.url}`} alt="" />
                    )}
                    <label htmlFor={`#${item.title}`}>{item.title}</label>
                  </span>
                  <button>
                    <MoreVertIcon />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Modal>
      <div className="grid-item" onClick={openFolderModal}>
        <FolderIcon></FolderIcon>
        <span>{folder.title}</span>
      </div>
    </>
  );
};

export default Folder;
