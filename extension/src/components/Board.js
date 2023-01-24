import React, { createContext, useEffect, useMemo, useState } from "react";
import GridItem from "./GridItem";
import "../styles/Board.css";
// import Bookmark from "./Bookmark";
// import Group from "./Group";
// import { ItemTypes } from "../pages/Home";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { ITEMS_PER_GROUP, ITEMS_PER_PAGE, ItemTypes } from "../utils/types";

/**
 * Invariants:
 *  * `items`
 *    * Items are all sorted by index
 *    * No two items have the same index
 *
 */
const Board = ({ items, isGroup, moveItemsOut, moveItem, page, convertContainer }) => {
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
            moveItemsOut={moveItemsOut}
            moveItem={moveItem}
            inGroup={isGroup}
            convertContainer={convertContainer}
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
          item={{ index: page * numItems + gridIdx, type: ItemTypes.EMPTY }}
          moveItem={moveItem}
          inGroup={isGroup}
        />
      );
    }

    return gridItems;
  }, [items, isGroup]);

  return <div className={`board ${isGroup ? "group-board" : "home-board"}`}>{grids}</div>;
};

export default Board;
