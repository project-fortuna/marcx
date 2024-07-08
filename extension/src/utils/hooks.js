import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTopLevelItems } from "../app/slices/topLevelItems";
import { addNewBookmarkNode, getAvailableIndices, getNewId } from "./functions";
import { BookmarkNode, ItemTypes, ROOT_ID } from "./types";

/**
 * Memoized array of items that should be currently displayed.
 * (i.e., the items on the current page)
 *
 * @param {BookmarkNode[]} allItems - Array of all items
 * @param {number} page - The current page
 * @param {number} itemsPerPage - Items per page
 * @returns {BookmarkNode[]} The displayed items for that current page
 */
export function useItemsByPage(allItems, page, itemsPerPage) {
  return useMemo(() => {
    if (!allItems) {
      return [];
    }

    const currentPageItems = allItems.filter(
      (item) =>
        // Get only the items on the current page
        item.index >= page * itemsPerPage && item.index < (page + 1) * itemsPerPage
    );

    // Sort the items by index
    currentPageItems.sort((item1, item2) => item1.index - item2.index);

    return currentPageItems;
  }, [allItems, page]);
}

export function useNewItemCreator() {
  const dispatch = useDispatch();
  const topLevelItems = useSelector((state) => state.topLevelItems);

  return useCallback(
    async (newItem) => {
      console.log("Creating new item");
      console.log(newItem);

      const availableIndex = getAvailableIndices([...topLevelItems], 1)[0];
      const id = await getNewId();

      // New item with default fields, can be overwritten by the incoming item
      // object
      const itemToAdd = {
        id,
        index: availableIndex,
        title: "No title",
        parentId: ROOT_ID,
        type: ItemTypes.EMPTY,
        dateAdded: Date.now(),
        ...newItem,
      };

      const addedItem = await addNewBookmarkNode(itemToAdd);
      console.log(`Successfully added new ${addedItem.type}`);
      console.log(addedItem);
      if (addedItem.parentId == ROOT_ID) {
        dispatch(updateTopLevelItems(topLevelItems.concat(addedItem)));
      }
    },
    [dispatch, topLevelItems]
  );
}
