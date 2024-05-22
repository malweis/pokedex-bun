"use client";
import React, { use, useEffect, useState } from "react";
import { useAppSelector } from "@/utils/usePokemon";
import Image from "next/image";
import {
  Ability,
  NamedAPIResource,
  Pokemon,
  PokemonClient,
  PokemonSpecies,
  Type,
  UtilityClient,
} from "pokenode-ts";
import {
  Box,
  Button,
  LinearProgress,
  Popover,
  Typography,
} from "@mui/material";
import { IconButton } from "@mui/material";
import { Info } from "@mui/icons-material";
import styled from "styled-components";

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

const ContainerData = styled.div`
  display: flex;
  gap: 1rem;
`;

const ContainerCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContainerMainData = styled.div`
  display: grid;
  width: 60%;
  border-radius: 8px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr ;
  gap: 1rem;
  background-color: #30a7d7;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: white;
`;

const AbilityData = styled.div`
  padding: 1rem;
`;

const Description = styled.div`
  width: 300px;
  
`;

const PokemonDetails = ({ params }: { params: { name: string } }) => {
  const selectedPokemon = useAppSelector(
    (state) => state.pokemon.selectedPokemon
  );
  const [, setLoading] = useState<boolean>(false);
  const [speciesData, setSpeciesData] = useState<PokemonSpecies | null>(null);
  const [abilityData, setAbilityData] = useState<Ability | null>(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [typeData, setTypeData] = useState<Type[]>([]);
  const [damageRelations, setDamageRelations] = useState({} as any);


  const handleClick = (event : any) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  useEffect(() => {
    const fetchSpecies = async () => {
      setLoading(true);
      const api = new PokemonClient();
      try {
        const pokemon = await api.getPokemonSpeciesByName(params.name);
        setSpeciesData(pokemon);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    };
    const fetchEvoChain = async () => {
      setLoading(true);
      const api = new UtilityClient();
      try {
        const pokemon = await api.getResourceByUrl(
          speciesData?.evolution_chain.url ?? ""
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    };
    const fetchAbility = async () => {
      if (selectedPokemon && selectedPokemon.abilities.length > 0) {
        const response = await fetch(selectedPokemon.abilities[0].ability.url);
        const data = await response.json();
        setAbilityData(data);
      }
    };
    const fetchTypeData = async () => {
      if (selectedPokemon && selectedPokemon.types.length > 0) {
        const typeResponses = await Promise.all(
          selectedPokemon.types.map((type) => fetch(type.type.url))
        );
        const typeData = await Promise.all(typeResponses.map((res) => res.json()));
        setTypeData(typeData);
      }
    };
  
    fetchTypeData();

    fetchAbility();
    fetchEvoChain();
    fetchSpecies();

  }, []);

  const combineDamageRelations = () => {
    if (typeData.length === 0) return {};
  
    const combined: {
      double_damage_from: NamedAPIResource[],
      double_damage_to: NamedAPIResource[],
      // add other damage relations as needed
    } = {
      double_damage_from: [],
      double_damage_to: [],
      // add other damage relations as needed
    };
  
    typeData.forEach((type) => {
      combined.double_damage_from.push(...type.damage_relations.double_damage_from);
      combined.double_damage_to.push(...type.damage_relations.double_damage_to);
    });
  
    const superEffectiveFrom = combined.double_damage_from.filter(
      (type, index, self) =>
        self.findIndex((t) => t.name === type.name) !== index
    );
    const superEffectiveTo = combined.double_damage_to.filter(
      (type, index, self) =>
        self.findIndex((t) => t.name === type.name) !== index
    );
  
    return {
      ...combined,
      super_effective_from: superEffectiveFrom,
      super_effective_to: superEffectiveTo,
    };
  };

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
    console.log(selectedPokemon);
  }, []);

  useEffect(() => {
    setDamageRelations(combineDamageRelations());
  }, [typeData]);

  return (
    <Main>
      {selectedPokemon && (
        <div>
          <h2>
            {selectedPokemon.name.charAt(0).toUpperCase() +
              selectedPokemon.name.slice(1)}
          </h2>
          <ContainerData>
            <ContainerImage>
              <Image
                src={selectedPokemon.sprites.front_default || ""}
                alt={selectedPokemon.name}
                width={300}
                height={300}
                unoptimized
                quality={100}
              />
            </ContainerImage>
            <ContainerCol>
              {speciesData &&
                speciesData.flavor_text_entries
                  .filter((entry) => entry.language.name === "en")
                  .slice(-1)
                  .map((entry, index) => (
                    <Description>
                      <p key={index}>{entry.flavor_text}</p>
                    </Description>
                  ))}
              <ContainerMainData>
                <ContainerCol>
                  <p>Height:</p> <p>{selectedPokemon.height}</p>
                </ContainerCol>
                <ContainerCol>
                  <p>Weight:</p> <p>{selectedPokemon.weight}</p>
                </ContainerCol>
                <ContainerCol>
                  <p>Genus:</p>{" "}
                  <p>
                    {speciesData &&
                      speciesData.genera
                        .find((entry) => entry.language.name === "en")
                        ?.genus.replace(" Pokémon", "")}
                  </p>
                </ContainerCol>
                <ContainerData>
                  <ContainerCol> <p>Ability:</p>{" "} <p>{abilityData && abilityData.name}</p></ContainerCol> 
                  <IconButton
                    aria-describedby="ability-popover"
                    color="primary"
                    onClick={handleClick}
                  >
                    <Info />
                  </IconButton>
                  <Popover
                    id="ability-popover"
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    >
                  
                    <Typography >
                  
                      {abilityData &&
                        abilityData.effect_entries
                          .filter((entry) => entry.language.name === "en")
                          .slice(-1)
                          .map((entry, index) => (
                            <AbilityData key={index}>{entry.effect}</AbilityData>
                          ))}
                    </Typography>
                  </Popover>
                </ContainerData>
              </ContainerMainData>
            </ContainerCol>
            <ContainerCol>
              {   damageRelations.double_damage_to && damageRelations.double_damage_to.length > 0 && (
                <ContainerCol>
                  <p>Strong Against:</p>
                  <ContainerData>
                    {damageRelations.double_damage_to.map((type: any) => (
                     <TypeShow
                     key={type.name}
                     color={getTypeColor(type.name)}
                   >
                      {type.name.toUpperCase()}
                    </TypeShow>
                    ))}
                  </ContainerData>
                </ContainerCol>
              )}
                {   damageRelations.double_damage_from && damageRelations.double_damage_from.length > 0 && (
                <ContainerCol>
                  <p>Weak Against:</p>
                  <ContainerData>
                    {damageRelations.double_damage_from.map((type: any) => (
                     <TypeShow
                     key={type.name}
                     color={getTypeColor(type.name)}
                   >
                      {type.name.toUpperCase()}
                    </TypeShow>
                    ))}
                  </ContainerData>
                </ContainerCol>
              )}
              
              {damageRelations.super_effective_from && damageRelations.super_effective_from.length > 0 && (
                <ContainerCol>
                  <p>Super Weak Against:</p>
                  <ContainerData>
                    {damageRelations.super_effective_from.map((type: any) => (
                      <TypeShow
                      key={type.name}
                      color={getTypeColor(type.name)}
                    >
                       {type.name.toUpperCase()}
                     </TypeShow>
                    ))}
                  </ContainerData>
                </ContainerCol>
              )}
              
              {damageRelations.super_effective_to && damageRelations.super_effective_to.length > 0 && (
                <ContainerCol>
                  <p>Super Strong Against:</p>
                  <ContainerData>
                    {damageRelations.super_effective_to.map((type: any) => (
                       <TypeShow
                       key={type.name}
                       color={getTypeColor(type.name)}
                     >
                        {type.name.toUpperCase()}
                      </TypeShow>
                    ))}
                  </ContainerData>
                </ContainerCol>
              )}
            </ContainerCol>
          </ContainerData>
          {selectedPokemon.stats.map((stat: any) => (
            <Box key={stat.stat.name} sx={{ width: "100%", mr: 1, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {stat.stat.name.toUpperCase()}: {stat.base_stat}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={normalise(stat.base_stat)}
                sx={{
                  width: "50%",
                  height: 10,
                  borderRadius: 5,
                  bgcolor: "grey.300",
                  "& > *": {
                    bgcolor: getTypeColor(selectedPokemon.types[0].type.name),
                  },
                }}
              />
            </Box>
          ))}
          {/* Add more information as needed */}
        </div>
      )}
    </Main>
  );
};

export default PokemonDetails;

const ContainerImage = styled.div`
  border-radius: 15%;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: gainsboro;
`;

const TypeShow = styled.span<{ color: string; }>`
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
  min-width: 5rem;
  max-width: 5rem;
  
`;