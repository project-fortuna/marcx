import { createSlice } from "@reduxjs/toolkit";
import { ROOT_ID } from "../../utils/types";

export const topLevelItemsSlice = createSlice({
  name: "topLevelItems",
  initialState: { items: null, editItemId: null },
  reducers: {
    updateTopLevelItems: (state, action) => {
      const newItems = action.payload;
      const updatedTopLevelItems = newItems.filter((node) => node.parentId == ROOT_ID);
      console.log("Updating top level items to", updatedTopLevelItems);
      state.items = updatedTopLevelItems;
    },
    moveItemsToTopLevel: (state, action) => {
      const items = action.payload;
      console.debug("Moving out the following items:");
      console.debug(items.map((item) => item.id));
      moveItemsIntoContainer(items, ROOT_ID);
    },
    setEditItemId(state, action) {
      state.editItemId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTopLevelItems, setEditItemId } = topLevelItemsSlice.actions;

export default topLevelItemsSlice.reducer;
