/**
 * Converts bookmarks
 *
 * @param {chrome.bookmarks.BookmarkTreeNode[]} bookmarks
 *
 * @returns {import("../../src/utils/types").BookmarkNode[]} The converted
 *    bookmark nodes
 */
function flattenTree(bookmarks) {
  const allNodes = [];

  for (let bookmark of bookmarks) {
    if (!bookmark.children) {
      // Leaf node, represents an actual bookmark
      allNodes.push({ ...bookmark, type: "bookmark" });
      continue;
    }

    const childrenIds = bookmark.children.map((child) => child.id);

    // Node has children, represents a folder
    allNodes.push({ ...bookmark, children: childrenIds, type: "folder" });

    // Recurse
    const flatNodes = flattenTree(bookmark.children);
    allNodes.push(...flatNodes);
  }

  return allNodes;
}

/**
 * Runs on first install
 *
 * Flattens the user's bookmarks and separates out the folders from the
 * bookmarks themselves
 */
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Extension installed, loading bookmarks");

  await chrome.storage.local.set({ firstUse: true });
  console.debug("Set firstUse to TRUE");

  const chromeBookmarks = await chrome.bookmarks.getTree();

  // Create a deep copy of the Chrome bookmarks
  const chromeBookmarksCopy = structuredClone(chromeBookmarks);
  const flatNodes = flattenTree(chromeBookmarksCopy);
  await chrome.storage.local.set({ bookmarkNodes: flatNodes });
});

chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
  console.log("User created a new bookmark or folder:", id);

  // Get current new bookmarks nodes
  const res = await chrome.storage.local.get("newBookmarkNodes");
  let currentNewNodes = res.newBookmarkNodes;
  if (!currentNewNodes) {
    currentNewNodes = [];
  }

  const newBookmarkNode = { ...bookmark };

  // No URL, the node is a new folder
  if (bookmark.url === undefined) {
    newBookmarkNode.type = "folder";
  } else {
    newBookmarkNode.type = "bookmark";
  }

  chrome.storage.local.set({ newBookmarkNodes: currentNewNodes.concat(newBookmarkNode) });
});
