// External imports
import React, { useEffect, useMemo, useRef } from "react";
import { useDrop } from "react-dnd";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

// Local imports
import "../styles/PageBorder.css";
import { ItemTypes } from "../utils/types";

const PageBorder = ({ left, page, onHover, invisible, children }) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [ItemTypes.BOOKMARK, ItemTypes.FOLDER, ItemTypes.GROUP],
      canDrop: () => false,
      drop: (incomingItem, monitor) => {
        console.log("DROPPED!");
        if (!monitor.didDrop()) {
          // Only move the item if the monitor has not already dropped it
          // Prevents multiple moves from happening (i.e. moving an item within
          // a group)
          // moveItem(incomingItem, item);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    []
  );

  const timer = useRef(null);

  useEffect(() => {
    if (isOver) {
      timer.current = setTimeout(() => {
        console.log("Hover complete");
        onHover();
      }, 1000);
    } else {
      clearTimeout(timer.current);
    }

    return () => {
      timer.current && clearTimeout(timer.current);
    };
  }, [isOver, page]);

  const showContent = useMemo(() => {
    if (!isOver) {
      return false;
    }

    if (left && page === 0) {
      return false;
    }

    return true;
  }, [left, page, isOver]);

  return (
    <div ref={drop} className={`PageBorder${invisible ? "-invisible" : ""}`}>
      {showContent && (
        <div
          className={`PageBorder-content ${left ? "left" : ""} ${invisible ? "full-border" : ""}`}
        >
          {!invisible &&
            (left ? <ArrowLeftIcon fontSize="large" /> : <ArrowRightIcon fontSize="large" />)}
        </div>
      )}
      <div style={{ height: "100%" }}>{children}</div>
    </div>
  );
};

export default PageBorder;
