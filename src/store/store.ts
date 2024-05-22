import { configureStore } from '@reduxjs/toolkit'
import pokemonReducer from './pokemon/pokemonSlice'

export const store =
   configureStore({
    reducer: {
        pokemon : pokemonReducer,
    },
  })


// Infer the type of makeStore

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch