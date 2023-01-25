import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDrag } from "react-dnd";
import { FAVICON_URL, ItemTypes } from "../utils/types";
// import "./Bookmark.css";
// import "../../utilities.css";
// import { Button, Icon, Input, Menu, Popup } from "semantic-ui-react";
import globeLight from "../images/globe-light.png";
import globeDark from "../images/globe-dark.png";
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

  const handleIconError = () => {
    console.warn(`Could not load icon for '${bookmark.title}'`);
    setDisplayedIcon(globeDark);
  };

  const [displayedIcon, setDisplayedIcon] = useState(FAVICON_URL + bookmark.url);

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
            opacity: isDragging ? 0.5 : 1,
          }}
          src={displayedIcon}
          onError={handleIconError}
        />
        <span className="grid-item-label">{bookmark.title}</span>
      </a>
    </>
  );
};

export default Bookmark;
