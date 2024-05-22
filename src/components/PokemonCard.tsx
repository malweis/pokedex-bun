import React, { useEffect, useState } from 'react';
import { NamedAPIResource, Pokemon, PokemonClient } from 'pokenode-ts';
import { Skeleton } from '@mui/material';

interface PokemonCardProps {
    name: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ name }) => {
    const [pokemonData, setPokemonData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const api = new PokemonClient();
            try {
                const pokemon = await api.getPokemonByName(name);
                setPokemonData(pokemon);
            } catch (error) {
                console.error('Error fetching Pokemon data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [name]);

    return (
        <div>
            <h2>{name}</h2>
            {loading ? (
                <Skeleton variant="rectangular" width={210} height={118} />
            ) : (
                pokemonData && (
                    <div>
                        <img src={pokemonData.sprites.front_default} alt={name} />
                        <p>Height: {pokemonData.height}</p>
                        <p>Weight: {pokemonData.weight}</p>
                        {/* Add more information as needed */}
                    </div>
                )
            )}
        </div>
    );
};

export default PokemonCard;