import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TagsState {
  isCreateTagModalOpen: boolean;
  selectedTagId: string | null;
}

const initialState: TagsState = {
  isCreateTagModalOpen: false,
  selectedTagId: null,
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    openCreateTagModal: (state) => {
      state.isCreateTagModalOpen = true;
    },
    closeCreateTagModal: (state) => {
      state.isCreateTagModalOpen = false;
    },
    selectTag: (state, action: PayloadAction<string | null>) => {
      state.selectedTagId = action.payload;
    },
  },
});

export const { openCreateTagModal, closeCreateTagModal, selectTag } =
  tagsSlice.actions;
export default tagsSlice.reducer;
