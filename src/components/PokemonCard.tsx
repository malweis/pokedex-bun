import React, { useEffect, useState } from "react";
import { NamedAPIResource, Pokemon, PokemonClient } from "pokenode-ts";
import { useSelectPokemon } from "../utils/usePokemon"; // replace with your actual path
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton, TextField } from "@mui/material";

interface PokemonCardProps {
  name: string;
}

interface CardProps {
  typeColor: string;
}

const Type = styled.span<{ color: string; isSingle: boolean }>`
  background-color: ${(props) => props.color};
  border-radius: 4px;
  padding: 0.5rem;
  margin: 0.5rem;
  font-size: 14px;
  color: white;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.isSingle ? "50%" : "100%")};
`;

const Card = styled.div`
  width: 100%;
  border: 1px solid gainsboro;
  border-radius: 8px;
  padding: 1rem;
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  min-width: 15rem;
`;

const Span = styled.span`
  align-self: flex-start;
  font-size: 24px;
  font-weight: bold;
`;

const TypeContainer = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const ContainerImage = styled.div`
  border-radius: 15%;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: gainsboro;
`;

const SkeletonImage = styled(Skeleton)`
  border-radius: 15%;
  width: 100%;
  height: 20rem;
`;

const SkeletonType = styled(Skeleton)`
  border-radius: 4px;
  width: 100%;
  height: 28px;
`;

const PokemonCard: React.FC<PokemonCardProps> = ({ name }) => {
  const [pokemonData, setPokemonData] = useState<any>(null);
  const [loading , setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const api = new PokemonClient();
      try {
        const pokemon = await api.getPokemonByName(name);
        setPokemonData(pokemon);
        setLoading(false);
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

  return (
    <Card onClick={() => router.push(`/pokemon/${name}`)}>
      {loading ? (
        <>
          <SkeletonImage variant="rectangular"  height={150} width={150} />
          <Skeleton variant="text" width="60%" />
          <TypeContainer>
            <SkeletonType variant="text" />
            <SkeletonType variant="text" />
          </TypeContainer>
        </>
      ) : pokemonData ? (
        <>
          <ContainerImage>
            <Image
              src={pokemonData.sprites.front_default || ""}
              alt={pokemonData.name}
              width={150}
              height={150}
              unoptimized
              quality={100}
            />
          </ContainerImage>
          {/* Render types */}
          <Span>{name.charAt(0).toUpperCase() + name.slice(1)}</Span>{" "}
          <TypeContainer>
            {pokemonData.types.map((type: any) => (
              <Type
                key={type.type.name}
                color={getTypeColor(type.type.name)}
                isSingle={pokemonData.types.length === 1}
              >
                {type.type.name.charAt(0).toUpperCase() +
                  type.type.name.slice(1)}
              </Type>
            ))}
          </TypeContainer>
          {/* Add more information as needed */}
        </>
      ) : null}
    </Card>
  );
};

export default PokemonCard;
