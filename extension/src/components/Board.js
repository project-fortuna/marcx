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
const Board = ({ items, isGroup, moveItemsOut, moveItem }) => {
  const grids = useMemo(() => {
    if (!items) {
      return [];
    }

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
          />
        );
        continue;
      }

      // No item was found at that grid index, push an empty grid item
      gridItems.push(
        <GridItem
          index={gridIdx}
          key={`empty-item-${gridIdx}`}
          item={{ type: ItemTypes.EMPTY }}
          moveItem={moveItem}
        />
      );
    }

    return gridItems;
  }, [items, isGroup]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={isGroup ? "group-board" : "home-board"}>{grids}</div>
    </DndProvider>
  );
};

// export const GridContext = createContext({
//   handleMoveGroup: null,
// });
// //TODO: create bookmark and group be home so that it updates
// /** Create a board that has bookmarks and groups
//  *
//  * @param inEditMode boolean value indicating whether the board can be edited or not
//  * @param userId the Google ID
//  * @param bookmarks the list of bookmarks for the given board
//  * @param groups the list of Groups elements for the given board
//  * @param size the number of grids for the board. 48 for home, 9 for a group.
//  * @param handleMoveGroup callback that will move the group after DnD
//  * @param handleMoveBookmark callback that will move the bookmark after DnD
//  * @param handleRemoveBookmark callback that will remove the bookmark after DnD
//  * @param indexHasNoBookmarks callback that determines whether there is a bookmark
//  *        at the desired drop location
//  * @param indexHasNoElements callback that determines whether there is an element
//  *        at the desired drop location
//  * @returns {JSX.Element}
//  * @constructor
//  */
// const Board = ({
//   inEditMode,
//   userId,
//   groupID,
//   bookmarks,
//   groups,
//   size,
//   handleMoveGroup,
//   handleMoveBookmark,
//   moveBookmarksInGroup,
//   handleMoveBookmarkToNewPage,
//   handleMoveBookmarkOut,
//   handleMoveGroupToNewPage,
//   handleRemoveBookmark,
//   handleRemoveGroup,
//   removeBookmarkFromGroup,
//   indexHasNoBookmarks,
//   indexHasNoElements,
//   indexHasNoBookmarksInGroup,
//   isDarkMode,
// }) => {
//   const [state, setState] = useState({
//     squares: [],
//   });

//   useEffect(() => {
//     console.log("refreshing board");
//     const tempSquares = [];
//     for (let i = 0; i < size; i++) {
//       tempSquares.push(addGrid(i, bookmarks, groups));
//       //console.log(tempSquares.length)
//     }

//     setState({ squares: tempSquares });
//   }, [bookmarks, groups, inEditMode]);

//   const addGrid = (i, bookmarks, groups) => {
//     const bookmarkAtIndex = bookmarks.filter((bookmark) => bookmark.index === i); //get bookmark with index i if exist
//     const groupAtIndex = groups.filter((group) => group.index === i); //get group with index i if exist
//     const hasBookmark = bookmarkAtIndex.length;
//     const hasGroup = groupAtIndex.length;
//     //element is a bookmark if it exist, or group, otherwise, nothing there
//     const element = hasBookmark ? bookmarkAtIndex[0] : hasGroup ? groupAtIndex[0] : null;
//     const type = hasBookmark ? ItemTypes.BOOKMARK : hasGroup ? ItemTypes.GROUP : null;

//     //console.log(element)
//     return (
//       <Grid
//         key={i}
//         index={i}
//         groupID={groupID}
//         // width={size === 48? "12.5%": "30%"}
//         // height={size === 48? "17%": "30%"}
//         handleMoveBookmark={handleMoveBookmark}
//         element={element}
//         userId={userId}
//         inEditMode={inEditMode}
//         type={type}
//         handleMoveGroup={handleMoveGroup}
//         moveBookmarksInGroup={moveBookmarksInGroup}
//         handleMoveBookmarkToNewPage={handleMoveBookmarkToNewPage}
//         handleMoveBookmarkOut={handleMoveBookmarkOut}
//         handleMoveGroupToNewPage={handleMoveGroupToNewPage}
//         handleRemoveBookmark={handleRemoveBookmark}
//         handleRemoveGroup={handleRemoveGroup}
//         removeBookmarkFromGroup={removeBookmarkFromGroup}
//         indexHasNoBookmarks={indexHasNoBookmarks}
//         indexHasNoElements={indexHasNoElements}
//         indexHasNoBookmarksInGroup={indexHasNoBookmarksInGroup}
//         isDarkMode={isDarkMode}
//       />
//     );
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       {size === 48 ? (
//         <div className={"home-board"} key={groups}>
//           {/*{console.log("board")}*/}
//           {/*{console.log(squares)}*/}
//           {state.squares}
//           {/*{state.squares.map((square) => <div className={"grid-individual"} key={square}>*/}
//           {/*  {square} </div>)}*/}
//         </div>
//       ) : (
//         <div className={"group-board"} key={groups}>
//           {state.squares}
//         </div>
//       )}
//     </DndProvider>
//   );
// };

// export default Board;

export default Board;
