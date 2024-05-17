import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_SETTINGS } from "../../utils/types";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: { ...DEFAULT_SETTINGS },
  reducers: {
    setWallpaper: (state, action) => {
      // const newItems = action.payload;
      // const updatedTopLevelItems = newItems.filter((node) => node.parentId == ROOT_ID);
      // return updatedTopLevelItems;
      console.log("setting wallpaper in store");
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWallpaper } = settingsSlice.actions;

export default settingsSlice.reducer;
