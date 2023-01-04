/*global chrome*/

import React, { useState } from "react";
import { BookmarkNode, FAVICON_URL } from "../utils/types";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import Modal from "./Modal";
import "../styles/Folder.css";
import { getBookmarkNodes } from "../utils/functions";

const Folder = ({ folder }) => {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

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
        <div className="Folder-modal">
          <span>
            <h1 onClick={resetBreadcrumbs}>{folder.title}</h1>
            <nav>
              {breadcrumbs.map((breadcrumb) => (
                <>
                  <ArrowRightIcon />
                  <h2 onClick={() => onBreadcrumbClick(breadcrumb)}>{breadcrumb.title}</h2>
                </>
              ))}
            </nav>
          </span>
          <ul>
            {children?.map((item) => {
              return (
                <li id={item.title} onDoubleClick={() => openListItem(item)}>
                  <span>
                    {item.type === "folder" ? (
                      <FolderIcon />
                    ) : (
                      <img src={`${FAVICON_URL}${item.url}`} alt="" />
                    )}
                    <label htmlFor={`#${item.title}`}>{item.title}</label>
                  </span>
                  <button>edit</button>
                </li>
              );
            })}
          </ul>
        </div>
      </Modal>
      <div onClick={openFolderModal}>
        <FolderIcon></FolderIcon>
        <span>{folder.title}</span>
      </div>
    </>
  );
};

export default Folder;
