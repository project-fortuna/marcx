// External imports
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDrag } from "react-dnd";

// Local imports
import { FAVICON_URL, ItemTypes } from "../utils/types";
import globeLight from "../images/globe-light.png";
import globeDark from "../images/globe-dark.png";

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
        className={`board-item`}
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          id="bookmarkImage"
          className={`board-item-main ${isDragging ? "wiggle" : ""}`}
          style={{
            opacity: isDragging ? 0.5 : 1,
          }}
          src={displayedIcon}
          onError={handleIconError}
        />
        <span className="board-item-label">{bookmark.title}</span>
      </a>
    </>
  );
};

export default Bookmark;
