import React, { useState } from "react";
import { getBookmarkNodes, overwriteBookmarkNodes } from "../utils/functions";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ToggleSwitch from "./utility-components/ToggleSwitch";
import SyncIcon from "@mui/icons-material/Sync";
import DataObjectIcon from "@mui/icons-material/DataObject";
import AppearanceIcon from "@mui/icons-material/WbSunny";
import ImageIcon from "@mui/icons-material/Image";
import "../styles/Settings.css";
import Modal from "./utility-components/Modal";
import { ItemTypes } from "../utils/types";
import { useDispatch } from "react-redux";
import { updateTopLevelItems } from "../app/slices/topLevelItems";

const Settings = () => {
  const [openModal, setOpenModal] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);

  const dispatch = useDispatch();

  const downloadBookmarkData = async () => {
    const allBookmarkData = await getBookmarkNodes();

    // Create the file object
    const file = new Blob([JSON.stringify(allBookmarkData)], { type: "application/json" });

    // Create anchor link
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "marcx-bookmarks-" + Date.now() + ".json";

    // Simulate link click
    document.body.appendChild(element);
    element.click();
  };

  const uploadBookmarkData = (file) => {
    console.debug("Uploading", file.name);

    setOpenModal("upload");
    const reader = new FileReader();
    reader.onload = () => {
      const json = JSON.parse(reader.result);
      setUploadedData(json);
    };
    reader.readAsText(file);
  };

  const overwriteBookmarkData = () => {
    if (!uploadedData) {
      console.warn("No bookmark data to upload");
      return;
    }
    console.log("About to upload", uploadedData.length, "items");

    overwriteBookmarkNodes(uploadedData).then((updatedNodes) =>
      dispatch(updateTopLevelItems(updatedNodes))
    );
    // TODO: Make sure the JSON file is valid
    setOpenModal(null);
  };

  return (
    <>
      <Modal open={openModal === "upload"} onClose={() => setOpenModal(null)}>
        <div className="upload-modal standard-modal-container shadow">
          <h1>Upload bookmark data</h1>
          <h3>Loaded the following bookmark data:</h3>
          <ul>
            {uploadedData?.map((item) => (
              <li key={item.id}>
                {item.type === ItemTypes.BOOKMARK ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    ({item.type}) {item.title}
                  </a>
                ) : (
                  <>
                    ({item.type}) {item.title}
                  </>
                )}
              </li>
            ))}
          </ul>
          <section>
            <h3>Are you sure you want to upload these bookmarks?</h3>
            <p className="warning-text">
              Warning: Existing data will be overwritten! Consider downloading the current data
              first.
            </p>
            <span>
              <button className="secondary-button" onClick={() => setOpenModal(null)}>
                Cancel
              </button>
              <button className="primary-button" onClick={overwriteBookmarkData}>
                Upload
              </button>
            </span>
          </section>
        </div>
      </Modal>
      <div className="Settings standard-modal-container shadow">
        <h1>Settings</h1>
        <section>
          <span className="section-header">
            <AppearanceIcon />
            <h3>Appearance Settings</h3>
          </span>
          <button className="primary-button">
            <ImageIcon />
            <label htmlFor="">Change Background (coming soon!)</label>
          </button>
          <span>
            <ToggleSwitch isChecked={true} handleOnChange={(e) => console.log(e)} />
            <p>Toggle dark mode (coming soon!)</p>
          </span>
        </section>
        <section className="upload-section">
          <span className="section-header">
            <DataObjectIcon />
            <h3>Bookmark Data Management</h3>
          </span>
          <button className="primary-button">
            <SyncIcon />
            <label htmlFor="">Sync Chrome Bookmarks (coming soon!)</label>
          </button>
          <label className="primary-button" onClick={() => setOpenModal("upload")}>
            <input
              type="file"
              className="invisible"
              accept=".json"
              onChange={(e) => {
                if (e.target.files[0]) {
                  uploadBookmarkData(e.target.files[0]);
                }
              }}
            />
            <FileUploadIcon />
            <span>Upload bookmarks</span>
          </label>
          <button className="primary-button" onClick={downloadBookmarkData}>
            <FileDownloadIcon />
            <label htmlFor="">Export bookmarks</label>
          </button>
        </section>
      </div>
    </>
  );
};

export default Settings;
