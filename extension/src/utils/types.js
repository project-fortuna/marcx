/**
 * @typedef BookmarkNode
 *
 * @property {string} id
 * @property {number} index
 * @property {string} title
 * @property {string} parentId - ID of the parent
 * @property {string} type - The type of bookmark node ("folder", "group", or
 *    "bookmark")
 * @property {number} dateAdded - UNIX timestamp of date added
 * @property {string} [url] - (Bookmarks only) The URL of the bookmark
 * @property {string[]} [children] (Folders or Groups only) List of children
 *    bookmark Node IDs
 */

const FAVICON_URL = "https://www.google.com/s2/favicons?sz=256&domain_url=";
const ROOT_ID = 0;
const ITEMS_PER_PAGE = 48;
const ITEMS_PER_GROUP = 9;

const ItemTypes = {
  BOOKMARK: "bookmark",
  FOLDER: "folder",
  GROUP: "group",
  EMPTY: "empty",
};

const TEST_BOOKMARK = {
  id: "9999",
  index: 3,
  title: "Test Bookmark",
  url: "https://reactjs.org/docs/hooks-custom.html",
  type: ItemTypes.BOOKMARK,
};

const TEST_GROUP = {
  id: "888888",
  index: 45,
  title: "Test group",
  type: ItemTypes.GROUP,
  children: [TEST_BOOKMARK.id],
};

const FORMS = {
  newBookmark: {
    name: "bookmarkName",
    url: "bookmarkUrl",
  },
  newGroup: {
    name: "groupName",
  },
  newFolder: {
    name: "folderName",
  },
};

module.exports = {
  FAVICON_URL,
  ROOT_ID,
  ITEMS_PER_PAGE,
  ITEMS_PER_GROUP,
  TEST_BOOKMARK,
  TEST_GROUP,
  ItemTypes,
  FORMS,
};
