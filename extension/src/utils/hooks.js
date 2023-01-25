import { useMemo } from "react";
import { BookmarkNode } from "./types";

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
