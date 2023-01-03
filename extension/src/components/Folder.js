/*global chrome*/

import React, { useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import Modal from "./Modal";
import "../styles/Folder.css";

const Folder = ({ folder }) => {
  const [open, setOpen] = useState(false);

  const [children, setChildren] = useState(null);

  const openFolder = () => {
    setOpen(true);
    getChildren();
  };

  const getChildren = (childrenIds) => {
    chrome.storage.local.get("bookmarks").then((res) => {
      const children = res.bookmarks.filter((bookmark) => folder.children.includes(bookmark.id));
      setChildren(children);
    });
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
