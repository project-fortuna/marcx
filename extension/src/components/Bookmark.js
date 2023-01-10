import React, { useState, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { FAVICON_URL, ItemTypes } from "../utils/types";
// import "./Bookmark.css";
// import "../../utilities.css";
// import { Button, Icon, Input, Menu, Popup } from "semantic-ui-react";
// import globe_light from "../../public/images/globe_light.png";
// import globe_dark from "../../public/images/globe_dark.png";
// import { useDrag } from "react-dnd";
// import { ItemTypes } from "../pages/Home";
// import { createContextFromEvent } from "../../utilities";

const Bookmark = ({ bookmark }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOOKMARK,
    item: bookmark,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <>
      <a
        ref={drag}
        className={`grid-item`}
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          id="bookmarkImage"
          className={`grid-item-container ${isDragging ? "wiggle" : ""}`}
          style={{
            // opacity: isDragging ? 0 : 1,
            // fontSize: 25,
            // fontWeight: "bold",
            // cursor: isDragging ? "grabbing" : inEditMode ? "grab" : "pointer",
            borderRadius: "20%",
          }}
          src={FAVICON_URL + bookmark.url}
          // onError={handleError}
        />
        <span className="grid-item-label">{bookmark.title}</span>
      </a>
    </>
  );
};

export default Bookmark;
