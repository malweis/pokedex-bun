"use client"
import React, { use, useEffect } from 'react'
import { useAppSelector } from '@/utils/usePokemon'
import Image from 'next/image';
import { Pokemon } from 'pokenode-ts';
import styled from 'styled-components';

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 4rem;
  min-height: 100vh;
  background-color: white;
  background-image: url(https://assets.pokemon.com/static2/_ui/img/chrome/container_bg.png);
  color: black;
`;


const PokemonDetails = ({ params }: { params: { name: string } }) => {
  const selectedPokemon = useAppSelector((state) => state.pokemon.selectedPokemon);
  useEffect(() => {
   console.log(selectedPokemon)
  }, []);

  return (
    <Main>
      {params.name}
      {selectedPokemon &&  <div>
      <h2>{selectedPokemon.name}</h2>
      <Image src={selectedPokemon.sprites.front_default || ''} alt={selectedPokemon.name}  width={150} height={150}/>
      <p>Height: {selectedPokemon.height}</p>
      <p>Weight: {selectedPokemon.weight}</p>
      {/* Add more information as needed */}
    </div>}
    </Main>
  )
}

export default PokemonDetails