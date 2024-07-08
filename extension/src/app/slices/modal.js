import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  type: null,
  formData: {},
};

export const modalSlice = createSlice({
  name: "modal",
  initialState: { ...initialState },
  reducers: {
    openModal: (state, action) => {
      const { type } = action.payload;
      state.isOpen = true;
      state.type = type;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    clearFormData: (state) => {
      state.formData = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { openModal, closeModal, updateFormData, clearFormData } = modalSlice.actions;

export default modalSlice.reducer;
