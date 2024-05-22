import { combineReducers, configureStore } from '@reduxjs/toolkit'
import pokemonReducer from './pokemon/pokemonSlice'
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    persistStore,
    persistReducer,
  } from 'redux-persist';

  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    };
  
  const rootReducer = combineReducers({
    pokemon : pokemonReducer,
  
  });
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });


// Infer the type of makeStore

// Infer the `RootState` and `AppDispatch` types from the store itself
export  const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch