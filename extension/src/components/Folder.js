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
          <span>
            <h1>{folder.title}</h1>
            <nav>breadcrumb navigation</nav>
          </span>
          <ul>
            {children?.map((item) => {
              return (
                <li id={item.title}>
                  <span>
                    {item.type === "folder" ? (
                      <FolderIcon></FolderIcon>
                    ) : (
                      <img
                        src={`https://www.google.com/s2/favicons?sz=256&domain_url=${item.url}`}
                        alt=""
                      />
                    )}
                    <label htmlFor={`#${item.title}`}>{item.title}</label>
                  </span>
                  <button>edit</button>
                </li>
              );
            })}
          </ul>
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
