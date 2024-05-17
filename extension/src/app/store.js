import { configureStore } from "@reduxjs/toolkit";

import topLevelItemsReducer from "./slices/topLevelItems";
import settingsReducer from "./slices/settings";

export default configureStore({
  reducer: {
    topLevelItems: topLevelItemsReducer,
    settings: settingsReducer,
  },
});
