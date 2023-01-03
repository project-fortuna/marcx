/*global chrome*/

import React, { useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import Modal from "./Modal";
import "../styles/Folder.css";
import { getBookmarkNodes } from "../utils/functions";

const Folder = ({ folder }) => {
  const [open, setOpen] = useState(false);

  const [children, setChildren] = useState(null);

  const openFolder = () => {
    setOpen(true);
    getChildren();
  };

  const getChildren = async () => {
    const children = await getBookmarkNodes((bookmark) => folder.children.includes(bookmark.id));
    console.log("Got", children);
    setChildren(children);
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="Folder-modal">
          Wow!
          {children?.map((item) => {
            return <span>{item.title}</span>;
          })}
        </div>
      </Modal>
      <div onClick={openFolder}>
        <FolderIcon></FolderIcon>
        <span>{folder.title}</span>
      </div>
    </>
  );
};

export default Folder;
