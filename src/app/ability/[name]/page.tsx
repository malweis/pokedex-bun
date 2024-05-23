"use client";
import React, {  useEffect, useState } from "react";
import { useAppSelector } from "@/utils/usePokemon";

import {

  Move,
  MoveClient,
 
} from "pokenode-ts";

import styled from "styled-components";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";
import { DataGrid } from '@mui/x-data-grid';


type Row = {
  id: number;
  name: string;
  type: string;
  target: string;
  pp: number | null;
  power: number | null;
};

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




const PokemonDetails = () => {


  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'target', headerName: 'Target', width: 150 },
    { field: 'pp', headerName: 'PP', width: 150 },
    { field: 'power', headerName: 'Power', width: 150 },
  ];
  const [rows, setRows] = useState<Row[]>([]);
    const [moves, setMoves] = useState<Move[]>([]);
  const selectedPokemon = useAppSelector(
    (state) => state.pokemon.selectedPokemon
  );

  const fetchAllMoves = async () => {
    const api = new MoveClient();
    const movesData : Move[] = [];
  
    for (const moveData of selectedPokemon?.moves ?? []) {
      const moveName = moveData.move.name;
      try {
        const response = await api.getMoveByName(moveName);
        movesData.push(response);
        setMoves(movesData);
      } catch (error) {
        console.error(`Error fetching data for move ${moveName}:`, error);
      }
    }
 
   
  };

  
 
useEffect(() => {
  fetchAllMoves();
} , [])

useEffect(() => {
  const newRows = moves.map((move, index) => {
    let name = move?.name || 'move';
    name = name.replace(/-/g, ' ');
    name = name.charAt(0).toUpperCase() + name.slice(1);

    let target = move.target.name;
    switch(target) {
      case 'user':
        target = 'self';
        break;
      case 'selected-pokemon':
        target = 'single';
        break;
      case 'all-opponents':
        target = 'multiple';
        break;
      default:
        break;
    }

    return {
      id: index,
      name: name,
      type: move.type.name,
      target: target,
      pp: move.pp,
      power: move.power,
    };
  });

  setRows(newRows);
}, [moves]);

  


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
    <Main>
     <Link href="/">
 
    <ArrowBackIcon style={{ color: 'blue' }} />
    <DataGrid
  rows={rows}
  columns={columns}
  initialState={{
    pagination: {
      paginationModel: { pageSize: 25, page: 0 },
    },
  }}
/>
 
</Link>
      
      
    </Main>
  );
};


export default PokemonDetails;


