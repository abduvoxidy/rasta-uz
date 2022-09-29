import { createSlice } from '@reduxjs/toolkit'

const commonSlice = createSlice({
  name: 'common',
  initialState: {
    addresses: [],
    regionId: null,
    branchId: null,
    isUnavailableDelivery: false,
    isUnavailableShipper: false,
    menuId: null,
  },
  reducers: {
    setAddress: (state, action) => {
      state.addresses = action.payload
    },
    setRegionId: (state, action) => {
      state.regionId = action.payload
    },
    setBranchId: (state, action) => {
      state.branchId = action.payload
    },
    setUnavailableDelivery: (state, action) => {
      state.isUnavailableDelivery = action.payload
    },
    setUnavailableShipper: (state, action) => {
      state.isUnavailableShipper = action.payload
    },
    setMenuId: (state, action) => {
      state.menuId = action.payload
    },
  },
})

export const {
  setAddress,
  setRegionId,
  setBranchId,
  setUnavailableDelivery,
  setUnavailableShipper,
  setMenuId,
} = commonSlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount))
//   }, 1000)
// }

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
// export const selectCount = (state) => state.counter?.value

export default commonSlice.reducer
