// External imports
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDrag } from "react-dnd";

// Local imports
import { FAVICON_URL, FORMS, ItemTypes } from "../utils/types";
import globeLight from "../images/globe-light.png";
import globeDark from "../images/globe-dark.png";
import { useDispatch, useSelector } from "react-redux";
import { BookmarkNode } from "../utils/types";
import Modal from "./utility-components/Modal";
import { setEditItemId } from "../app/slices/topLevelItems";
import { updateFormData } from "../app/slices/modal";
import { updateBookmarkNodes } from "../utils/functions";

/**
 *
 * @param {object} props
 * @param {BookmarkNode} props.bookmark
 * @returns
 */
const Bookmark = ({ bookmark }) => {
  // Redux hooks
  const dispatch = useDispatch();
  const isEditing = useSelector((state) => state.topLevelItems.editItemId === bookmark.id);
  const modalData = useSelector((state) => state.modal);
  const formData = modalData.formData;

  useEffect(() => {
    // On edit, set current form data to be current bookmark data
    if (isEditing) {
      dispatch(updateFormData({ [FORMS.newBookmark.url]: bookmark.url }));
      dispatch(updateFormData({ [FORMS.newBookmark.name]: bookmark.title }));
    }
  }, [isEditing]);

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

  const submitEdit = async (e) => {
    e.preventDefault();
    console.log("bookmark edited", formData);

    const editedTitle = formData[FORMS.newBookmark.name];
    const editedUrl = formData[FORMS.newBookmark.url];
    // Edited values are invalid, early return
    if (editedTitle.trim().length === 0 || editedUrl.trim().length === 0) {
      // todo(casillasenrique) Provide a more helpful error message
      return;
    }

    // If the URL is changed, update the favicon URL
    if (editedUrl !== bookmark.url) {
      setDisplayedIcon(FAVICON_URL + editedUrl);
    }

    // Update the bookmark node title and url
    await updateBookmarkNodes([bookmark.id], (item) => ({
      ...item,
      title: editedTitle,
      url: editedUrl,
    }));
    dispatch(setEditItemId(null));
  };

  const [displayedIcon, setDisplayedIcon] = useState(FAVICON_URL + bookmark.url);

  return (
    <>
      <Modal open={isEditing} onClose={() => dispatch(setEditItemId(null))}>
        <div className="standard-modal-container shadow">
          <form
            onSubmit={submitEdit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div className="form-item">
              <label htmlFor={FORMS.newBookmark.url}>URL</label>
              <input
                className="text-input"
                id={FORMS.newBookmark.url}
                type="text"
                value={formData[FORMS.newBookmark.url] || (isEditing ? "" : bookmark.url)}
                onChange={(e) =>
                  dispatch(updateFormData({ [FORMS.newBookmark.url]: e.target.value }))
                }
                autoFocus
              />
            </div>
            <div className="form-item">
              <label htmlFor={FORMS.newBookmark.name}>Bookmark name</label>
              <input
                className="text-input"
                id={FORMS.newBookmark.name}
                type="text"
                value={formData[FORMS.newBookmark.name] || (isEditing ? "" : bookmark.title)}
                onChange={(e) =>
                  dispatch(updateFormData({ [FORMS.newBookmark.name]: e.target.value }))
                }
              />
            </div>
            <button className="primary-button">Save Changes</button>
          </form>
        </div>
      </Modal>
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
