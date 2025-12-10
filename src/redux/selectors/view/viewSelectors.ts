import { RootState } from '../../store';
import { viewsApi } from '../../api/view/viewsApi';

// Selectors for the local UI state
export const selectSelectedView = (state: RootState) => state.views.selectedView;
export const selectFilterByType = (state: RootState) => state.views.filterByType;
export const selectFilterByUser = (state: RootState) => state.views.filterByUser;
export const selectFilterByViewable = (state: RootState) => state.views.filterByViewable;
export const selectSortBy = (state: RootState) => state.views.sortBy;
export const selectSearchQuery = (state: RootState) => state.views.searchQuery;
export const selectDateRange = (state: RootState) => state.views.dateRange;
export const selectTrackedViews = (state: RootState) => state.views.trackedViews;
export const selectViewDebounceMap = (state: RootState) => state.views.viewDebounceMap;
export const selectTrackingConfig = (state: RootState) => state.views.trackingConfig;

// If you needed to select data from the RTK Query cache manually:
// Note: This is usually discouraged in favor of the hooks.
export const selectViewsByUser = viewsApi.endpoints.getViewsByUser.select;
export const selectViewsByPost = viewsApi.endpoints.getViewsByPost.select;
export const selectViewStats = viewsApi.endpoints.getViewStats.select;
export const selectViewAnalytics = viewsApi.endpoints.getViewAnalytics.select;
