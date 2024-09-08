/*global chrome*/

// External imports
import React, { useEffect, useMemo, useState } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OutboxIcon from "@mui/icons-material/Outbox";
import Folder from "@mui/icons-material/Folder";
import Delete from "@mui/icons-material/Delete";
import { useDrag, useDrop } from "react-dnd";

// Local imports
import "../styles/Group.css";
import Board from "./Board";
import PageBorder from "./PageBorder";
import Modal from "./utility-components/Modal";
import Dropdown from "./utility-components/Dropdown";
import { BookmarkNode } from "../utils/types";
import { useItemsByPage } from "../utils/hooks";
import {
  convertGroupToFolder,
  deleteBookmarkNodes,
  getBookmarkNodes,
  moveItemsIntoContainer,
} from "../utils/functions";
import { FAVICON_URL, ITEMS_PER_GROUP, ItemTypes, ROOT_ID } from "../utils/types";
import globeDark from "../images/globe-dark.png";

// Redux
import { useDispatch } from "react-redux";

/**
 *
 * @param {object} props
 * @param {BookmarkNode} props.group
 * @returns
 */
const Group = ({ group }) => {
  // React hooks
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getChildren(group.id);
  }, [group?.children]);

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
        thumbnailItems.push(
          <img
            key={item.id}
            src={`${FAVICON_URL}${item.url}`}
            alt={item.url}
            onError={() => console.warn(`Could not load ${item.title}`)}
          />
        );
        continue;
      }

      // No item was found at that grid index, push an empty div
      thumbnailItems.push(<div key={`empty-item-${gridIdx}`} />);
    }

    return thumbnailItems;
  }, [children]);

  // Redux hooks
  const dispatch = useDispatch();

  // React D&D Hooks
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.GROUP,
    item: group,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

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
          moveItemsIntoContainer([incomingItem], ROOT_ID);
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

  // Custom hooks
  const displayedChildren = useItemsByPage(children, page, ITEMS_PER_GROUP);

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
    console.log(`Got group ${groupId}'s children:`, newChildren);
    setChildren(newChildren);
  };

  const handleMoveAllItemsOut = () => {
    // Move items out to the top level
    moveItemsIntoContainer(children, ROOT_ID);

    // Clear the current children list
    setChildren([]);
  };

  const deleteGroup = () => {
    console.debug(`About to delete ${group.id} (${group.title})`);
    deleteBookmarkNodes([group.id]).then(() => {
      setOpen(false);
      return;
    });
  };

  const convertToFolder = () => {
    console.debug(`Converting "${group.title}" to folder`);
    convertGroupToFolder(group.id).then(() => {
      setOpen(false);
    });
  };

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
            <h1>{group.title}</h1>
            <Dropdown buttonIcon={<MoreVertIcon />}>
              <button id="move-all-out" onClick={handleMoveAllItemsOut}>
                <OutboxIcon />
                <label htmlFor="move-all-out">Move all folder contents out</label>
              </button>
              <button id="delete-group" onClick={deleteGroup}>
                <Delete />
                <label htmlFor="delete-group">Delete group</label>
              </button>
              <button id="convert-to-folder" onClick={convertToFolder}>
                <Folder />
                <label htmlFor="convert-to-folder">Convert to folder</label>
              </button>
            </Dropdown>
          </header>
          <main className="Group-main">
            <PageBorder onHover={() => page > 0 && setPage(page - 1)} page={page} left invisible>
              <button
                id="group-previous"
                title="Previous Page"
                disabled={page <= 0}
                onClick={() => page > 0 && setPage(page - 1)}
              >
                <ArrowLeftIcon style={{ fontSize: "3rem" }} fontSize="inherit" />
              </button>
            </PageBorder>
            <div className="Group-container glass shadow" style={{ backdropFilter: "none" }}>
              <div
                style={{
                  position: "absolute",
                  inset: "0",
                  backdropFilter: "blur(10px)",
                  zIndex: "-1",
                  borderRadius: "2rem",
                }}
              ></div>
              <Board items={displayedChildren} isGroup={true} page={page} id={group.id} />
            </div>
            <PageBorder onHover={() => setPage(page + 1)} page={page} invisible>
              <button id="group-next" title="Next Page" onClick={() => setPage(page + 1)}>
                <ArrowRightIcon style={{ fontSize: "3rem" }} fontSize="inherit" />
              </button>
            </PageBorder>
          </main>
          <footer className="Group-footer">
            <h2>Page {page + 1}</h2>
          </footer>
        </div>
      </Modal>
      <button ref={drag} className="board-item" onClick={openGroupModal}>
        <article className={`Group-thumbnail board-item-main glass ${isDragging ? "wiggle" : ""}`}>
          {displayedThumbnailItems}
        </article>
        <span className="board-item-label">{group.title}</span>
      </button>
    </>
  );
};

export default Group;
