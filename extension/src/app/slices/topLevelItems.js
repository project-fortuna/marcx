import { createSlice } from "@reduxjs/toolkit";
import { ROOT_ID } from "../../utils/types";

export const topLevelItemsSlice = createSlice({
  name: "topLevelItems",
  initialState: null,
  reducers: {
    updateTopLevelItems: (state, action) => {
      const newItems = action.payload;
      const updatedTopLevelItems = newItems.filter((node) => node.parentId == ROOT_ID);
      return updatedTopLevelItems;
    },
    moveItemsToTopLevel: (state, action) => {
      const items = action.payload;
      console.debug("Moving out the following items:");
      console.debug(items.map((item) => item.id));

      moveItemsIntoContainer(items, ROOT_ID).then((updatedNodes) => {
        const updatedTopLevelNodes = updatedNodes.filter((node) => node.parentId == ROOT_ID);
        // Move the nodes to the top level in the front end after backend has
        // been updated
        setTopLevelItems(updatedTopLevelNodes);
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTopLevelItems } = topLevelItemsSlice.actions;

export default topLevelItemsSlice.reducer;
