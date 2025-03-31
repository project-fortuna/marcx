import { configureStore } from "@reduxjs/toolkit";

import topLevelItemsReducer from "./slices/topLevelItems";
import settingsReducer from "./slices/settings";
import modalReducer from "./slices/modal";

export default configureStore({
  reducer: {
    topLevelItems: topLevelItemsReducer,
    settings: settingsReducer,
    modal: modalReducer,
  },
});
