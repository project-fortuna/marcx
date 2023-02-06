import { configureStore } from "@reduxjs/toolkit";

import topLevelItemsReducer from "./slices/topLevelItems";

export default configureStore({
  reducer: {
    topLevelItems: topLevelItemsReducer,
  },
});
