import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pokemon } from 'pokenode-ts';

interface PokemonState {
  selectedPokemon: Pokemon | null;
}

const initialState: PokemonState = {
  selectedPokemon: null,
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    selectPokemon(state, action: PayloadAction<Pokemon | null>) {
      state.selectedPokemon = action.payload;
    },
  },
});

export const { selectPokemon } = pokemonSlice.actions;

export default pokemonSlice.reducer;