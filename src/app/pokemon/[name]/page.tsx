"use client"
import React, { use, useEffect } from 'react'
import { useAppSelector } from '@/utils/usePokemon'
import Image from 'next/image';
import { Pokemon } from 'pokenode-ts';
import { Box, LinearProgress, Typography } from '@mui/material';

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

  const getTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      normal: "#A1A1A1",
      fire: "#D43A2F",
      water: "#4A90DA",
      grass: "#5D9E3C",
      fighting: "#F08733",
      flying: "#8FB8E5",
      poison: "#6E4B97",
      electric: "#F2C340",
      ground: "#895229",
      psychic: "#DC4D7A",
      rock: "#ADA985",
      ice: "#78CCF0",
      bug: "#95A135",
      dragon: "#4C60A8",
      ghost: "#6B426E",
      dark: "#4E403F",
      steel: "#74A2B8",
      fairy: "#BA7FB5",

      // add more types as needed
    };

    return typeColors[type] || "gainsboro"; // default color if type is not in the map
  };
  
  const normalise = (value: number) => (value * 100) / 255;


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
      {selectedPokemon.stats.map((stat: any) => (
        <Box key={stat.stat.name} sx={{ width: '100%', mr: 1, mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {stat.stat.name.toUpperCase()}: {stat.base_stat}
          </Typography>
          <LinearProgress variant="determinate" value={normalise(stat.base_stat)} sx={{
            width: '50%',
            height: 10,
            borderRadius: 5,
            bgcolor: 'grey.300',
            '& > *': {
              bgcolor: getTypeColor(selectedPokemon.types[0].type.name),
            },
          
          }} />
        </Box>
      ))}
      {/* Add more information as needed */}
    </div>}
    </Main>
  )
}

export default PokemonDetails