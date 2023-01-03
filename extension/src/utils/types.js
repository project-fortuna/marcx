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

module.exports = {};
