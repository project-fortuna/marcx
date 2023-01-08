/*global chrome*/

import React, { useEffect, useState } from "react";
import { BookmarkNode, FAVICON_URL, ItemTypes } from "../utils/types";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OutboxIcon from "@mui/icons-material/Outbox";

import Modal from "./utility-components/Modal";
import Dropdown from "./utility-components/Dropdown";
import "../styles/Group.css";
import { getBookmarkNodes } from "../utils/functions";
import { useDrag } from "react-dnd";
import Board from "./Board";

const Group = ({ group, moveItemsOut }) => {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.GROUP,
    item: group,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    getChildren(group.id);
  }, []);

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
  const openGroupModal = () => {
    setOpen(true);
    getChildren(group.id);
  };

  const getChildren = async (groupId) => {
    const newChildren = await getBookmarkNodes((bookmark) => bookmark.parentId === groupId);
    newChildren.sort((item1, item2) => item1.index - item2.index);
    console.log("Got", newChildren);
    setChildren(newChildren);
  };

  return (
    <>
      {/* <Modal open={open} onClose={() => setOpen(false)}>
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
                  <span>
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
                  <button>
                    <MoreVertIcon />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Modal> */}
      <button ref={drag} className="grid-item" onClick={openGroupModal}>
        <article className={`Group-thumbnail grid-item-container ${isDragging ? "wiggle" : ""}`}>
          {/* TODO: Create proper thumbnail children display (with empty item support) */}
          {children?.map((child) => (
            <img src={`${FAVICON_URL}${child.url}`} alt="" />
          ))}
        </article>
        <span className="grid-item-label">{group.title}</span>
      </button>
    </>
  );
};

export default Group;
