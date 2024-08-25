// External imports
import React, { useMemo, useState } from "react";
import { useDrop } from "react-dnd";

// Local imports
import Group from "./Group";
import Folder from "./Folder";
import Bookmark from "./Bookmark";
import { ItemTypes, BookmarkNode } from "../utils/types";
import { moveItemsIntoContainer, updateBookmarkNodes } from "../utils/functions";

// Redux
import { useDispatch } from "react-redux";
import { updateTopLevelItems } from "../app/slices/topLevelItems";

/** A droppable element that together builds a board for our bookmarks manager interface
 * TODO: Fix docstring
 *
 * @param {object} props of the Grid item wrt to other Grid objects
 * @param {object} props.index a Bookmark or Group object
 * @returns {JSX.Element}
 * @constructor
 */
const GridItem = ({ index, item, inGroup, onContextMenu }) => {
  const dispatch = useDispatch();

  /**
   *
   * @param {BookmarkNode} itemToMove
   * @param {BookmarkNode} targetItem
   */
  const moveItem = (itemToMove, targetItem) => {
    console.log(`Moving item ${itemToMove.id} (${itemToMove.title}) to index ${targetItem.index}`);
    console.debug(`Target item is type '${targetItem.type}'`);
    switch (targetItem.type) {
      case ItemTypes.EMPTY:
        updateBookmarkNodes([itemToMove.id], (item) => ({
          ...item,
          index: targetItem.index,
        })).then((updatedNodes) => {
          dispatch(updateTopLevelItems(updatedNodes));
        });
        break;
      case ItemTypes.FOLDER:
      case ItemTypes.GROUP:
        moveItemsIntoContainer([itemToMove], targetItem.id).then((updatedNodes) => {
          dispatch(updateTopLevelItems(updatedNodes));
        });
        break;
      default:
        console.error("Invalid target item type, could not move");
        break;
    }
  };

  const [{ isOverGrid, canDrop }, drop] = useDrop(
    () => ({
      accept: [ItemTypes.BOOKMARK, ItemTypes.FOLDER, ItemTypes.GROUP],
      canDrop: (incomingItem) =>
        // You can't move an item into a container if it's already in that container
        // Anything can be dropped into empty grids
        // Bookmarks can be dropped anywhere except other bookmarks
        // Folders can be dropped into other folders
        incomingItem.parentId !== item.id &&
        (item.type === ItemTypes.EMPTY ||
          (incomingItem.type === ItemTypes.FOLDER && item.type === ItemTypes.FOLDER) ||
          (incomingItem.type === ItemTypes.BOOKMARK && item.type !== ItemTypes.BOOKMARK)),
      drop: (incomingItem, monitor) => {
        if (!monitor.didDrop()) {
          // Only move the item if the monitor has not already dropped it
          // Prevents multiple moves from happening (i.e. moving an item within
          // a group)
          moveItem(incomingItem, item);
        }
      },
      collect: (monitor) => ({
        isOverGrid: !!monitor.isOver({ shallow: true }),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [item]
  );

  const displayedItem = useMemo(() => {
    switch (item.type) {
      case ItemTypes.FOLDER:
        return <Folder folder={item} />;
      case ItemTypes.BOOKMARK:
        return <Bookmark bookmark={item} />;
      case ItemTypes.GROUP:
        return <Group group={item} />;
      default:
        return <></>;
    }
  }, [item]);

  const className = useMemo(() => {
    const classes = [];
    // Add primary class
    if (inGroup) {
      classes.push("Board-grid-square-group");
    } else {
      classes.push("Board-grid-square");
    }

    // Add any hover stylings
    if (isOverGrid) {
      if (canDrop) {
        classes.push("droppable");
      } else {
        classes.push("not-droppable");
      }
    }

    return classes.join(" ");
  }, [inGroup, isOverGrid, canDrop]);

  function onContextMenuWrapper(e, type) {
    if (
      (type === "outer" && item.type === ItemTypes.EMPTY) ||
      (type === "inner" && item.type !== ItemTypes.EMPTY)
    ) {
      onContextMenu(e, item);
      return;
    }
  }

  return (
    <div ref={drop} className={className} onContextMenu={(e) => onContextMenuWrapper(e, "outer")}>
      <div onContextMenu={(e) => onContextMenuWrapper(e, "inner")}>{displayedItem}</div>
    </div>
  );
};

export default GridItem;
