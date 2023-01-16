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
import { useDrag, useDrop } from "react-dnd";
import Board from "./Board";
import { useItemsByPage } from "../utils/hooks";
import PageBorder from "./PageBorder";

const Group = ({ group, moveItemsOut, moveItem }) => {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState(null);
  const [page, setPage] = useState(0);

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

  const displayedChildren = useItemsByPage(children, page, ITEMS_PER_GROUP);

  const [{ isOver }, moveOutDrop] = useDrop(
    () => ({
      accept: [ItemTypes.BOOKMARK],
      canDrop: (incomingItem, monitor) => {
        // console.log(incomingItem);
        return monitor.isOver({ shallow: true });
      },
      drop: (incomingItem, monitor) => {
        if (!monitor.didDrop()) {
          console.debug("Dropped outside!");
          moveItemsOut([incomingItem]);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver({ shallow: true }),
      }),
    }),
    []
  );

  const [{ isOverGroup }, noDrop] = useDrop(
    () => ({
      accept: [ItemTypes.BOOKMARK],
      canDrop: (incomingItem, monitor) => {
        // console.debug(monitor.isOver({ shallow: true }));
        return false;
      },
      collect: (monitor) => ({
        isOverGroup: !!monitor.isOver({ shallow: true }),
      }),
    }),
    []
  );

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)} droppableBackgroundRef={moveOutDrop}>
        <div
          className="Group-droppable-area"
          style={{ backgroundColor: isOver ? "hsla(0, 0%, 100%, 10%)" : "transparent" }}
        >
          {isOver && <h1>Drop to move item out of group</h1>}
        </div>
        <div className="Group" ref={noDrop}>
          <header className="Group-header">
            <h2>Page {page + 1}</h2>
          </header>
          <main className="Group-main">
            <PageBorder onHover={() => page > 0 && setPage(page - 1)} page={page} left invisible>
              <button
                id="group-previous"
                title="Previous Page"
                disabled={page <= 0}
                onClick={() => page > 0 && setPage(page - 1)}
              >
                <ArrowLeftIcon fontSize="inherit" />
              </button>
            </PageBorder>
            <div className="Group-container glass shadow">
              <Board
                items={displayedChildren}
                isGroup={true}
                moveItemsOut={moveItemsOut}
                moveItem={moveItem}
                page={page}
              />
            </div>
            <PageBorder onHover={() => setPage(page + 1)} page={page} invisible>
              <button id="group-next" title="Next Page" onClick={() => setPage(page + 1)}>
                <ArrowRightIcon fontSize="inherit" />
              </button>
            </PageBorder>
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
        <article
          className={`Group-thumbnail grid-item-container glass ${isDragging ? "wiggle" : ""}`}
        >
          {displayedThumbnailItems}
        </article>
        <span className="grid-item-label">{group.title}</span>
      </button>
    </>
  );
};

export default Group;
