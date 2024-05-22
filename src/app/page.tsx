"use client"
import React, { useEffect, useState } from 'react';
import { NamedAPIResource, NamedAPIResourceList, Pokemon, PokemonClient, UtilityClient } from 'pokenode-ts';
import axios from 'axios';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { Button, Skeleton } from '@mui/material';
import PokemonCard from '@/components/PokemonCard';
import styles from '@/app/page.module.css';

export default function Home() {
  const router = useRouter()

  const [pokemonList, setPokemonList] = useState<NamedAPIResource[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const api = new PokemonClient();
    
      try {
        const pokemonData  = await api.listPokemons();
        
        setPokemonList(pokemonData.results);
        setNextUrl(pokemonData.next);
        setPrevUrl(pokemonData.previous);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchPokemons = async (url: string) => {
    setLoading(true);
    const utilityApi = new UtilityClient();

    try {
      const pokemonData : NamedAPIResourceList = await utilityApi.getResourceByUrl(url);

      setPokemonList(pokemonData.results);
      setNextUrl(pokemonData.next);
      setPrevUrl(pokemonData.previous);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.main}>
      {/* Rest of your code */}
    
        <div >
          <h1>Pokemon List</h1>
          <GridContainer >
            {
              pokemonList.map((pokemon) => (
                <Button key={pokemon.name} type="button" onClick={() => router.push(`/pokemon/${pokemon.name}`)}>
                  <PokemonCard name={pokemon.name} />
                </Button>
              ))
            }
          </GridContainer>
          <div>
            {prevUrl && <Button onClick={() => fetchPokemons(prevUrl)}>Previous</Button>}
            {nextUrl && <Button onClick={() => fetchPokemons(nextUrl)}>Next</Button>}
          </div>
        </div>
 
    </main>
  );
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 10px;
`;