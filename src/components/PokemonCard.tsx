import React, { useEffect, useState } from 'react';
import { NamedAPIResource, Pokemon, PokemonClient } from 'pokenode-ts';
import { useSelectPokemon } from '../utils/usePokemon'; // replace with your actual path

interface PokemonCardProps {
    name: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ name }) => {
    const [pokemonData, setPokemonData] = useState<any>(null);
    const selectPokemon = useSelectPokemon();

    useEffect(() => {
        const fetchData = async () => {
            const api = new PokemonClient();
            try {
                const pokemon = await api.getPokemonByName(name);
                setPokemonData(pokemon);
               
            } catch (error) {
                console.error('Error fetching Pokemon data:', error);
            }
        };

        fetchData();
    }, [name, selectPokemon]);

    return (
        <div>
            <h2>{name}</h2>
            {pokemonData && (
                <div>
                    <img src={pokemonData.sprites.front_default} alt={name} onClick={() =>  selectPokemon(pokemonData)} />
                    <p>Height: {pokemonData.height}</p>
                    <p>Weight: {pokemonData.weight}</p>
                    {/* Add more information as needed */}
                </div>
            )}
        </div>
    );
};

export default PokemonCard;