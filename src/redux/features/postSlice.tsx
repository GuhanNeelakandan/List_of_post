import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { NodeURL } from '../../api/api';


export const fetchAllPostList = createAsyncThunk(
    'posts/fetchAllPostList',
    async (tableOption, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${NodeURL}/get/all/post/list`, tableOption);
        if (response.data.status === 1 || response.data.status === 0) {
          return response.data.response.result;
        } else {
          return rejectWithValue('Error fetching blogs');
        }
      } catch (error:any) {
        return rejectWithValue(error.response?.data?.message || 'Server Error');
      }
    }
  );
  
  // Slice to manage blog state
  const postSlice = createSlice({
    name: 'blogs',
    initialState: {
      list: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllPostList.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllPostList.fulfilled, (state, action) => {
          state.loading = false;
          state.list = action.payload;
        })
        .addCase(fetchAllPostList.rejected, (state, action:any) => {
          state.loading = false;
          state.error = action.payload || 'An Error Occured';
        });
    },
  });
  
  export default postSlice.reducer;