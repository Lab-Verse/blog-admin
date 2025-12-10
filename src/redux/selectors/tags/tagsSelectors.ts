import { RootState } from '../../store';

// Selectors for the local UI state
export const selectIsCreateTagModalOpen = (state: RootState) =>
  state.tags.isCreateTagModalOpen;
export const selectSelectedTagId = (state: RootState) =>
  state.tags.selectedTagId;

// If you needed to select data from the RTK Query cache manually:
// Note: This is usually discouraged in favor of the hooks.
import { tagsApi } from '../../api/tags/tagsApi';

export const selectTagList = tagsApi.endpoints.getTags.select();

// Example of a re-selector to get the list of tags:
// const { data: tagList } = useSelector(selectTagList());
