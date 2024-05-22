"use client";
import React, { useEffect, useState } from "react";
import {
  NamedAPIResource,
  NamedAPIResourceList,
  Pokemon,
  PokemonClient,
  UtilityClient,
} from "pokenode-ts";
import axios from "axios";
import Link from "next/link";
import styled from "styled-components";

import { Button, InputAdornment, Skeleton, TextField } from "@mui/material";
import PokemonCard from "@/components/PokemonCard";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import styles from "@/app/page.module.css";

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

const ButtonContainer = styled.div`
width: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

export default function Home() {
  const [pokemonList, setPokemonList] = useState<NamedAPIResource[]>([]);
  const [displayList, setDisplayList] = useState<NamedAPIResource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const api = new PokemonClient();

      try {
        const pokemonData = await api.listPokemons(0, 1300);
        setPokemonList(pokemonData.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setDisplayList(pokemonList.slice(page * 20, (page + 1) * 20));
  }, [pokemonList, page]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
    if (event.target.value) {
      setDisplayList(pokemonList.filter(pokemon => pokemon.name.includes(event.target.value)));
    } else {
      setDisplayList(pokemonList.slice(0, 20));
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setDisplayList(pokemonList.slice(0, 20));
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <Main>
      <h1>React Pokedex</h1>
      <TextField
        size="small"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end" onClick={handleClearSearch}>
              <ClearIcon />
            </InputAdornment>
          )
        }}
      />
     <ButtonContainer>
  {page > 0 && (
    <Button sx={{
      minWidth: "120px",
      backgroundColor: "blue",
      color: "white",
      "&:hover": {
        backgroundColor: "blue",
        color: "white",
      },
    }} onClick={handlePrev}>Previous</Button>
  )}
  {(page + 1) * 20 < pokemonList.length && (
    <Button sx={{
      minWidth: "120px",
      backgroundColor: "blue",
      color: "white",
      "&:hover": {
        backgroundColor: "blue",
        color: "white",
      },
    }} onClick={handleNext}>Next</Button>
  )}
</ButtonContainer>
      <GridContainer>
        {displayList.map((pokemon) => (
          <PokemonCard name={pokemon.name} key={pokemon.name} />
        ))}
      </GridContainer>
      <ButtonContainer>
  {page > 0 && (
    <Button sx={{
      minWidth: "120px",
      backgroundColor: "blue",
      color: "white",
      "&:hover": {
        backgroundColor: "blue",
        color: "white",
      },
    }} onClick={handlePrev}>Previous</Button>
  )}
  {(page + 1) * 20 < pokemonList.length && (
    <Button sx={{
      minWidth: "120px",
      backgroundColor: "blue",
      color: "white",
      "&:hover": {
        backgroundColor: "blue",
        color: "white",
      },
    }} onClick={handleNext}>Next</Button>
  )}
</ButtonContainer>
    </Main>
  );
};

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-template-rows: repeat(4, 1fr);
  gap: 2rem;
`;
