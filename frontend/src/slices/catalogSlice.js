import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  catalogCourse: null
}

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setCatalog: (state, action) => {
      state.catalogCourse = action.payload
    },
    resetCatalogState: (state) => {
      state.catalogCourse = null
    },
  },
})

export const {
  setCatalog,
  resetCatalogState
} = catalogSlice.actions

export default catalogSlice.reducer