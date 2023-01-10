import React, { useContext, useEffect, useMemo, useState } from "react";
import Folder from "./Folder";
import Bookmark from "./Bookmark";
import { ItemTypes } from "../utils/types";
import { useDrop } from "react-dnd";
import Group from "./Group";

/** A droppable element that together builds a board for our bookmarks manager interface
 * TODO: Fix docstring
 *
 * @param {object} props of the Grid item wrt to other Grid objects
 * @param {object} props.index a Bookmark or Group object
 * @param type ItemsType object indicating the type of element
 * @param userId the Google ID
 * @param inEditMode boolean representing whether the Grid can be edited/dragged or not
 * @param width the percentage of a grid width according to whether this is in a group or home screen
 * @param height the percentage of a grid height according to whether this is in a group or home screen
 * @param handleMoveGroup callback that will move the group after DnD
 * @param handleMoveBookmark callback that will move the bookmark after DnD
 * @param handleRemoveBookmark callback that will remove the bookmark after DnD
 * @param indexHasNoBookmarks callback that determines whether there is a bookmark
 *        at the desired drop location
 * @param indexHasNoElements callback that determines whether there is an element
 *        at the desired drop location
 * @returns {JSX.Element}
 * @constructor
 */
const GridItem = ({ index, item, moveItemsOut, moveItem, inGroup }) => {
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
        return <Folder folder={item} moveItemsOut={moveItemsOut} />;
      case ItemTypes.BOOKMARK:
        return <Bookmark bookmark={item} />;
      case ItemTypes.GROUP:
        return <Group group={item} moveItemsOut={moveItemsOut} moveItem={moveItem} />;
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

  return (
    <div ref={drop} className={className}>
      {displayedItem}
    </div>
  );
};

export default GridItem;
