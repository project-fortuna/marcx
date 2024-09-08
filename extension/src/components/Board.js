// External imports
import React, { useMemo, useState } from "react";

// Local imports
import GridItem from "./GridItem";
import "../styles/Board.css";
import { ITEMS_PER_GROUP, ITEMS_PER_PAGE, ItemTypes, BookmarkNode } from "../utils/types";
import ContextMenu from "./ContextMenu";
import { useItemDeleter } from "../utils/hooks";

/**
 * Invariants:
 *  * `items`
 *    * Items are all sorted by index
 *    * No two items have the same index
 * @param {object} props
 * @param {BookmarkNode[]} props.items
 * @param {boolean} props.isGroup
 * @param {string} id - The ID of the board. Will match the ID of the item
 *    that provides the board to the user (i.e. the home page or a group)
 *
 */
const Board = ({ items, isGroup, page, id }) => {
  const [contextMenu, setContextMenu] = useState({ isOpen: false, contextItem: null });

  const openContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opened context menu in", item.index, item.type);
    console.log(e);
    setContextMenu({ ...contextMenu, isOpen: true, x: e.pageX, y: e.pageY, contextItem: item });
  };

  const closeContextMenu = (e) => {
    setContextMenu({ ...contextMenu, isOpen: false });
  };

  const grids = useMemo(() => {
    if (!items) {
      return [];
    }

    // FIXME: Potential bug if there are multiple items at x % numItems. Test by
    // creating multiple pages with items and check the grid

    // Create the grid items
    const gridItems = [];
    const numItems = isGroup ? ITEMS_PER_GROUP : ITEMS_PER_PAGE;
    let nextItemIdx = 0;
    for (let gridIdx = 0; gridIdx < numItems; gridIdx++) {
      // Check if the next item's index matches the current grid index; if so,
      // push the item into that grid space
      if (items[nextItemIdx]?.index % numItems === gridIdx) {
        const item = items[nextItemIdx];
        nextItemIdx++;

        gridItems.push(
          <GridItem
            index={gridIdx}
            key={item.id}
            item={item}
            inGroup={isGroup}
            onContextMenu={openContextMenu}
          />
        );
        continue;
      }

      // No item was found at that grid index, push an empty grid item
      gridItems.push(
        <GridItem
          index={gridIdx}
          key={`empty-item-${gridIdx}`}
          // Make sure the index is the index across *all* pages
          item={{
            index: page * numItems + gridIdx,
            type: ItemTypes.EMPTY,
            parentId: id,
          }}
          inGroup={isGroup}
          onContextMenu={openContextMenu}
        />
      );
    }

    return gridItems;
  }, [items, isGroup]);

  return (
    <>
      {contextMenu.isOpen && <ContextMenu {...contextMenu} onClick={closeContextMenu} />}
      <div onClick={closeContextMenu} className={`board ${isGroup ? "group-board" : "home-board"}`}>
        {grids}
      </div>
    </>
  );
};

export default Board;
