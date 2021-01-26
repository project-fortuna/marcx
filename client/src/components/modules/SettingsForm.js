import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Icon,
  Menu,
  Header,
  Button,
  Radio,
  Modal,
  Step,
  Input,
  Segment,
} from "semantic-ui-react";
import UploadBookmarksHelp from "./UploadBookmarksHelp";
import UploadBackgroundHelp from "./UploadBackgroundHelp";
import IconSelect from "./IconSelect";
import standardIcon from "../../public/images/globe.png";
import fileUpload from "../../public/images/fileUpload.png";
import { GoogleLogout } from "react-google-login";
const PLACEHOLDER_URL = "https://www.google.com/";
const PLACEHOLDER_NAME = "Google";
const FAVICON_URL = "https://www.google.com/s2/favicons?sz=256&domain_url=";
const URL_REGEX =
  "((http|https)://)?(www.)?" +
  "[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]" +
  "{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)";

/** A bookmark form to be used for handling the creating of a new bookmark
 *
 * @param onSubmit callback functions that handles the creation of a new bookmark on the home screen on submit
 * @param closeForm callback functions that handles closing the bookmark form
 * @returns {JSX.Element} A bookmark form that has options for URLs, name, and icons
 * @constructor
 */

const SettingsForm = ({ isOpen, closeModal, handleEditSettings, onSubmit, isDarkMode }) => {
  const [state, setState] = useState({
    bookmarksFile: undefined,
    backgroundFile: undefined,
    darkModeToggle: true,
    uploadBookmarksHelpToggle: false,
    uploadBackgroundHelpToggle: false,
  });

  const bookmarksInputRef = useRef(null);
  const backgroundInputRef = useRef(null);

   useEffect(() => {
     setState({ ...state, darkModeToggle: isDarkMode})
  }, [isDarkMode]);

  /** Submits the form to make a new bookmark
   *
   */
  const handleSubmit = () => {
    onSubmit && onSubmit(state);

    handleEditSettings(state.backgroundFile, state.bookmarksFile, state.darkModeToggle);
    
    setState({ ...state, bookmarksFile: undefined, backgroundFile: undefined });
  };

  return (
    <>
      <UploadBookmarksHelp
        onClose={() => setState({ ...state, uploadBookmarksHelpToggle: false })}
        open={state.uploadBookmarksHelpToggle}
        isDarkMode={state.darkModeToggle}
      />

      <UploadBackgroundHelp
        onClose={() => setState({ ...state, uploadBackgroundHelpToggle: false })}
        open={state.uploadBackgroundHelpToggle}
        isDarkMode={state.darkModeToggle}
      />
      <Modal
        dimmer="blurring"
        closeIcon
        size="mini"
        className={"NewComponentModal ui modal" + (!state.darkModeToggle ? " light" : "")}
        open={isOpen}
        onClose={closeModal}
      >
        <Modal.Content
          className={"NewComponentModal modal" + (!state.darkModeToggle ? " light" : "")}
        >
          <Form size="big" inverted={state.darkModeToggle}  style={{ backgroundColor: "rgb(39, 39, 39) !important" }}>
            <Header as="h2" inverted={state.darkModeToggle} color="grey">
              Settings
            </Header>

            <label>Upload Bookmarks</label>
            <Form.Group inline>
              <Form.Field>
                <Button
                  icon
                  labelPosition="right"
                  inverted={state.darkModeToggle}
                  onClick={() => {
                    console.log("clicked on default");
                    bookmarksInputRef.current.click();
                  }}
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    id="htmlFile"
                    accept=".html"
                    className="IconSelect-invisibleInput"
                    ref={bookmarksInputRef}
                    onChange={(event) => {
                      //console.log(event.target.files[0]);
                      if (event.target.files[0]) {
                        setState({ ...state, bookmarksFile: event.target.files[0] });
                      } else {
                        setState({ ...state, bookmarksFile: null });
                      }
                    }}
                  />
                  <Icon name="upload"></Icon>
                </Button>
              </Form.Field>
              <Form.Field>
                <Form.Button
                  size="mini"
                  circular
                  inverted={state.darkModeToggle}
                  icon="question"
                  onClick={() => setState({ ...state, uploadBookmarksHelpToggle: true })}
                ></Form.Button>
              </Form.Field>
            </Form.Group>
            <p
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {state.bookmarksFile && state.bookmarksFile.name}
            </p>

            <label>Change Background </label>
            <Form.Group inline>
              <Form.Field>
                <Button
                  icon
                  labelPosition="right"
                  inverted={state.darkModeToggle}
                  onClick={() => {
                    console.log("clicked on default");
                    backgroundInputRef.current.click();
                  }}
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    id="imgFile"
                    accept="image/*"
                    className="IconSelect-invisibleInput"
                    ref={backgroundInputRef}
                    onChange={(event) => {
                      console.log(event.target.files[0]);
                      if (event.target.files[0]) {
                        setState({ ...state, backgroundFile: event.target.files[0] });
                      } else {
                        setState({ ...state, backgroundFile: null });
                      }
                    }}
                  />
                  <Icon name="upload"></Icon>
                </Button>
              </Form.Field>
              <Form.Field>
                <Form.Button
                  onClick={() => setState({ ...state, uploadBackgroundHelpToggle: true })}
                  size="mini"
                  circular
                  inverted={state.darkModeToggle}
                  icon="question"
                ></Form.Button>
              </Form.Field>
            </Form.Group>
            <p
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {state.backgroundFile && state.backgroundFile.name}
            </p>

            <label>Change Theme</label>
            <Form.Group inline>
              <Form.Field>
                <Radio
                  toggle
                  onChange={() => setState({ ...state, darkModeToggle: !state.darkModeToggle })}
                  checked={state.darkModeToggle}
                />
              </Form.Field>
              <p style={{ fontSize: "small", color: "rgb(200,200,200)" }}>
                {state.darkModeToggle ? "Dark mode" : "Light mode"}
              </p>
            </Form.Group>

            <Form.Button
              inverted={state.darkModeToggle}
              primary
              size="large"
              type="button"
              onClick={handleSubmit}
            >
              Save Changes
            </Form.Button>
          </Form>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default SettingsForm;
