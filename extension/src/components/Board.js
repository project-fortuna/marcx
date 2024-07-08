// External imports
import React, { useMemo, useState } from "react";

// Local imports
import GridItem from "./GridItem";
import "../styles/Board.css";
import { ITEMS_PER_GROUP, ITEMS_PER_PAGE, ItemTypes } from "../utils/types";
import ContextMenu from "./ContextMenu";

/**
 * Invariants:
 *  * `items`
 *    * Items are all sorted by index
 *    * No two items have the same index
 *
 */
const Board = ({ items, isGroup, page }) => {
  const [contextMenu, setContextMenu] = useState({ isOpen: false });

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

        gridItems.push(<GridItem index={gridIdx} key={item.id} item={item} inGroup={isGroup} />);
        continue;
      }

      // No item was found at that grid index, push an empty grid item
      gridItems.push(
        <GridItem
          index={gridIdx}
          key={`empty-item-${gridIdx}`}
          // Make sure the index is the index across *all* pages
          item={{ index: page * numItems + gridIdx, type: ItemTypes.EMPTY }}
          inGroup={isGroup}
        />
      );
    }

    return gridItems;
  }, [items, isGroup]);

  const openContextMenu = (e) => {
    e.preventDefault();
    console.log("Opened context menu in", items[0]?.parentId);
    console.log(e);
    setContextMenu({ ...contextMenu, isOpen: true, x: e.pageX, y: e.pageY });
  };

  const closeContextMenu = (e) => {
    setContextMenu({ ...contextMenu, isOpen: false });
  };

  return (
    <>
      {/* TODO: Move the context menu to be opened on individual grid items */}
      {contextMenu.isOpen && <ContextMenu {...contextMenu} onClick={closeContextMenu} />}
      <div
        onContextMenu={openContextMenu}
        onBlur={closeContextMenu}
        onClick={closeContextMenu}
        className={`board ${isGroup ? "group-board" : "home-board"}`}
      >
        {grids}
      </div>
    </>
  );
};

export default Board;
