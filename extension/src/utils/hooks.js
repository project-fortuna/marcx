import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewBookmarkNode,
  deleteBookmarkNodes,
  getAvailableIndices,
  getNewId,
} from "./functions";
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
      console.log(`Successfully added new ${addedItem.type},`, addedItem);
    },
    [dispatch, topLevelItems]
  );
}

export function useItemDeleter() {
  const dispatch = useDispatch();

  return useCallback(
    /**
     *
     * @param {BookmarkNode[]} items
     */
    async (items) => {
      console.debug("Deleting", items);
      await deleteBookmarkNodes(items);

      // // If the top-level folder is deleted, close the modal
      // if (currentFolder.parentId == ROOT_ID) {
      // setOpen(false);
      // return;
      // }

      // // Otherwise update the breadcrumbs (and children)
      // setBreadcrumbs(breadcrumbs.slice(0, breadcrumbs.length - 1));
      // getChildren(currentFolder.parentId);
    },
    [dispatch]
  );
}
