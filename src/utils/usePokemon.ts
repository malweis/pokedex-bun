import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState, AppDispatch } from '../store/store'; // replace with your actual path
import { selectPokemon } from '../store/pokemon/pokemonSlice'; // replace with your actual path
import { Pokemon } from 'pokenode-ts';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useSelectPokemon = () => {
  
  const dispatch = useAppDispatch();
  return (pokemon: Pokemon | null) => dispatch(selectPokemon(pokemon));
};