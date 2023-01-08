/*global chrome*/

import { BookmarkNode } from "./types";

/**
 * Gets bookmark nodes from Chrome storage based on a matching function.
 *
 * No matching function may be provided, in which case all bookmark nodes are
 * returned.
 *
 * @param {function} [matchingFn] - Function that takes in a bookmark node and
 *    returns True or False. Only bookmark nodes that pass this matching
 *    function will be returned.
 * @returns {BookmarkNode[]} The list of bookmark nodes
 */
export async function getBookmarkNodes(matchingFn) {
  const res = await chrome.storage.local.get("bookmarkNodes");

  if (!matchingFn) {
    return res.bookmarkNodes;
  }

  const filteredNodes = res.bookmarkNodes.filter(matchingFn);
  return filteredNodes;
}

export async function addNewBookmarkNode(item) {
  const currentNodes = await getBookmarkNodes();
  await chrome.storage.local.set({ bookmarkNodes: currentNodes.concat(item) });
}

/**
 * Updates a given list of bookmark nodes/items.
 *
 * @param {string[]} itemIds
 * @param {function} updateFn - Function that takes in an item/bookmark node and
 *    returns the updated item
 */
export async function updateBookmarkNodes(itemIds, updateFn) {
  const currentNodes = await getBookmarkNodes();
  const updatedNodes = currentNodes.map((item) => {
    if (itemIds.includes(item.id)) {
      console.log("Updating");
      return updateFn(item);
    }
    return item;
  });

  await chrome.storage.local.set({ bookmarkNodes: updatedNodes });

  return updatedNodes;
}

/**
 * Gets the available indices within a list of items.
 *
 * Adapted from ChatGPT solution
 *
 * @param {BookmarkNode[]} items - The items currently occupying the indices
 * @param {number} numIncomingItems - The number of items that need spaces among
 *    the items given above
 */
export function getAvailableIndices(items, numIncomingItems) {
  const availableIndices = [];

  if (!items.length) {
    // Return array of 0 to N - 1 if items array is empty
    return Array.from(Array(numIncomingItems).keys());
  }

  // Sort the list of items by index
  items.sort((a, b) => a.index - b.index);

  // Iterate through the list of items
  for (let i = 0; i < items.length; i++) {
    const currentItem = items[i];

    // Check for gaps between the current item and the previous item
    if (i > 0 && currentItem.index > items[i - 1].index + 1) {
      // If there are, add the all indices to the list of available indices
      for (let j = items[i - 1].index + 1; j < currentItem.index; j++) {
        availableIndices.push(j);
      }
    }
  }

  // Add the remaining indices after the last item
  const lastIndex = items[items.length - 1].index;
  for (let i = lastIndex + 1; i < lastIndex + numIncomingItems; i++) {
    availableIndices.push(i);
  }

  return availableIndices;
}

/**
 * Moves items into a container.
 *
 * Note: All items must have previously been in the same container.
 *
 * @param {BookmarkNode[]} items
 * @param {string} containerId
 *
 * @return {BookmarkNode[]} List of *all* items, not just the updated ones TODO:
 * could just return the updated items
 */
export async function moveItemsIntoContainer(items, containerId) {
  // Old container ID used to clear the leaving items from the children list
  const oldContainerId = items[0].parentId;

  // Sort by index so that items can retain their relative positions within the
  // new container
  items.sort((a, b) => a.index - b.index);
  const itemIds = items.map((item) => item.id);

  // Get ALL current nodes
  const currentNodes = await getBookmarkNodes();

  // Get the available indices given the current container items
  const containerItems = currentNodes.filter((node) => node.parentId == containerId);
  const availableIndices = getAvailableIndices(containerItems, items.length);

  let indexCounter = 0;
  const updatedNodes = currentNodes.map((node) => {
    if (node.id === oldContainerId) {
      // Clear the items being moved out from the list
      return { ...node, children: node.children.filter((childId) => !itemIds.includes(childId)) };
    }

    if (node.id === containerId) {
      // Update the container to include the new children IDs
      return { ...node, children: node.children.concat(itemIds) };
    }

    if (itemIds.includes(node.id)) {
      // Update the items so that their parent ID is the container ID; also set
      // the correct index
      const updatedNode = { ...node, parentId: containerId, index: availableIndices[indexCounter] };
      indexCounter++;
      return updatedNode;
    }

    return node;
  });

  // Set updated nodes in the backend
  await chrome.storage.local.set({ bookmarkNodes: updatedNodes });

  return updatedNodes;
}
