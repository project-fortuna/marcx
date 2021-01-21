import React, { createContext, useEffect, useState } from "react";
import Grid from "./Grid";
import Bookmark from "./Bookmark";
import Group from "./Group";
import './Board.css';
import { ItemTypes } from "../pages/Home";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { post } from "../../utilities";
export const GridContext = createContext({
    handleMoveGroup: null
  }
)

//TODO: create bookmark and group be home so that it updates
const Board = ({handleMoveGroup,inEditMode,userId, bookmarks, groups }) =>{
  const [state, setState] = useState({
    squares: []
  });

  useEffect(() => {
    const tempSquares = []
    for (let i = 0; i < 48; i++) {
      tempSquares.push(addGrid(i, bookmarks,groups))
      console.log(tempSquares.length)
    }

    setState({squares: tempSquares})
  },[bookmarks,groups]);


  const addGrid = (i, bookmarks, groups) => {
    const bookmarkAtIndex = bookmarks.filter((bookmark) => bookmark.index === i); //get bookmark with index i if exist
    const groupAtIndex = groups.filter((group) => group.index === i); //get group with index i if exist
    const hasBookmark = bookmarkAtIndex.length;
    const hasGroup = groupAtIndex.length;
    //element is a bookmark if it exist, or group, otherwise, nothing there
    const element = hasBookmark ? (
      bookmarkAtIndex[0]
    ) : hasGroup ? (
      groupAtIndex[0]
    ) : null;
    const type = hasBookmark ? (
      ItemTypes.BOOKMARK
    ) : hasGroup ? (
      ItemTypes.GROUP
    ) : null;

    console.log(element)
    return (
        <Grid
          index={i}
          handleMoveGroup={handleMoveGroup}
          element={element}
          userId={userId}
          inEditMode={inEditMode}
          type={type}/>
    );
  }


  return (

    <DndProvider backend = {HTML5Backend}>
    <div className={"whole-board"} key = {groups}>
      {/*{console.log("board")}*/}
      {/*{console.log(squares)}*/}
      {state.squares}
      {/*{state.squares.map((square) => <div className={"grid-individual"} key={square}>*/}
      {/*  {square} </div>)}*/}
    </div>
    </DndProvider>
  )
}

export default Board;