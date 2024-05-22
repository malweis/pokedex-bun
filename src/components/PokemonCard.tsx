import React, { useEffect, useState } from "react";
import { NamedAPIResource, Pokemon, PokemonClient } from "pokenode-ts";
import { useSelectPokemon } from "../utils/usePokemon"; // replace with your actual path
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { TextField } from "@mui/material";

interface PokemonCardProps {
  name: string;
}

interface CardProps {
  typeColor: string;
}

const Card = styled.div<CardProps>`
  background-color: ${(props) => props.typeColor};
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const Span = styled.span`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const PokemonCard: React.FC<PokemonCardProps> = ({ name }) => {
  const [pokemonData, setPokemonData] = useState<any>(null);
  const selectPokemon = useSelectPokemon();
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const api = new PokemonClient();
      try {
        const pokemon = await api.getPokemonByName(name);
        setPokemonData(pokemon);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    };

    fetchData();
  }, []);

  const getTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      normal: "#A1A1A1",
      fire: "#D43A2F", 
        water: "#4A90DA",
        grass: "#5D9E3C",
        fighting: "#F08733",
        flying: "#8FB8E5",
        poison: "#6E4B97",
        electric:"#F2C340",
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

  return (
    <Card
      typeColor={
        pokemonData
          ? getTypeColor(pokemonData.types[0].type.name)
          : "transparent"
      }
      onClick={() => router.push(`/pokemon/${name}`)}
    >
      <Span>{name.charAt(0).toUpperCase() + name.slice(1)}</Span>{" "}
      {pokemonData && (
        <div>
          <img
            src={pokemonData.sprites.front_default}
            alt={name}
            onClick={() => selectPokemon(pokemonData)}
          />
          <p>Height: {pokemonData.height}</p>
          <p>Weight: {pokemonData.weight}</p>
          {/* Add more information as needed */}
        </div>
      )}
    </Card>
  );
};

export default PokemonCard;
