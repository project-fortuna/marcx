/*global chrome*/

import React, { useEffect, useMemo, useState } from "react";
import { BookmarkNode, FAVICON_URL, ITEMS_PER_GROUP, ItemTypes } from "../utils/types";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OutboxIcon from "@mui/icons-material/Outbox";

import Modal from "./utility-components/Modal";
import Dropdown from "./utility-components/Dropdown";
import "../styles/Group.css";
import { getBookmarkNodes } from "../utils/functions";
import { useDrag } from "react-dnd";
import Board from "./Board";

const Group = ({ group, moveItemsOut, moveItem }) => {
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
  }, [group?.children]);

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

  const displayedThumbnailItems = useMemo(() => {
    if (!children) {
      return [];
    }

    // Create the grid items
    const thumbnailItems = [];
    let nextItemIdx = 0;
    for (let gridIdx = 0; gridIdx < ITEMS_PER_GROUP; gridIdx++) {
      // Check if the next item's index matches the current grid index; if so,
      // push the item's thumbnail into that grid space
      if (children[nextItemIdx]?.index % ITEMS_PER_GROUP === gridIdx) {
        const item = children[nextItemIdx];
        nextItemIdx++;
        thumbnailItems.push(<img src={`${FAVICON_URL}${item.url}`} alt={item.url} />);
        continue;
      }

      // No item was found at that grid index, push an empty div
      thumbnailItems.push(<div />);
    }

    return thumbnailItems;
  }, [children]);

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="Group">
          <header className="Group-header">
            <h2>Page {1}</h2>
          </header>
          <main className="Group-main">
            <button title="Previous Page">
              <ArrowLeftIcon />
            </button>
            <div className="Group-container">
              <Board
                items={children}
                isGroup={true}
                moveItemsOut={moveItemsOut}
                moveItem={moveItem}
              />
            </div>
            <button title="Next Page">
              <ArrowRightIcon />
            </button>
          </main>
          <footer className="Group-footer">
            <h1>{group.title}</h1>
            <Dropdown buttonIcon={<MoreVertIcon />}>
              <button id="move-all-out" onClick={handleMoveAllItemsOut}>
                <OutboxIcon />
                <label htmlFor="move-all-out">Move all folder contents out</label>
              </button>
              <button>Other</button>
            </Dropdown>
          </footer>
        </div>
      </Modal>
      <button ref={drag} className="grid-item" onClick={openGroupModal}>
        <article className={`Group-thumbnail grid-item-container ${isDragging ? "wiggle" : ""}`}>
          {displayedThumbnailItems}
        </article>
        <span className="grid-item-label">{group.title}</span>
      </button>
    </>
  );
};

export default Group;
