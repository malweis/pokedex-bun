"use client"
import React, { useEffect } from 'react'
import { useAppSelector } from '@/utils/usePokemon'
import Image from 'next/image';
import { Pokemon } from 'pokenode-ts';




const PokemonDetails = ({ params }: { params: { name: string } }) => {
  const selectedPokemon = useAppSelector((state) => state.pokemon.selectedPokemon);

  return (
    <div>
      {params.name}
      {selectedPokemon &&  <div>
      <h2>{selectedPokemon.name}</h2>
      <Image src={selectedPokemon.sprites.front_default || ''} alt={selectedPokemon.name}  width={150} height={150}/>
      <p>Height: {selectedPokemon.height}</p>
      <p>Weight: {selectedPokemon.weight}</p>
      {/* Add more information as needed */}
    </div>}
    </div>
  )
}

export default PokemonDetails