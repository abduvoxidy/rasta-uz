import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import commonSlice from './common/commonSlice'
//import counterSlice from './counter/counterSlice'
import cartSlice from './cart/cartSlice'

// const persistConfig = {
//   key: 'root',
//   version: process.env.REDUX_PERSIST_MIGRATION_VERSION,
//   storage,
// }

const cartPersistConfig = {
  key: 'cart',
  storage: storage,
  whitelist: ['cartItems'],
}

const commonPersistConfig = {
  key: 'common',
  storage: storage,
  whitelist: ['branchId'],
}

const rootReducer = combineReducers({
  //counter: persistReducer(persistConfig, counterSlice),
  cart: persistReducer(cartPersistConfig, cartSlice),
  common: persistReducer(commonPersistConfig, commonSlice),
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)
