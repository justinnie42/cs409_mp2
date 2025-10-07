import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PokemonDetail {
  name: string;
  image: string;
  types: string[];
  abilities: string[];
  stats: { name: string; base_stat: number }[];
  height: number;
  weight: number;
}

const DetailView: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pokemonList, setPokemonList] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const names = response.data.results.map((pokemon: { name: string }) => pokemon.name);
        setPokemonList(names);
      } catch (error) {
        console.error('Error fetching Pokémon list:', error);
      }
    };
    fetchPokemonList();
  }, []);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = response.data;

        const details: PokemonDetail = {
          name: data.name,
          image: data.sprites.front_default,
          types: data.types.map((type: { type: { name: string } }) => type.type.name),
          abilities: data.abilities.map((ability: { ability: { name: string } }) => ability.ability.name),
          stats: data.stats.map((stat: { stat: { name: string }; base_stat: number }) => ({
            name: stat.stat.name,
            base_stat: stat.base_stat,
          })),
          height: data.height,
          weight: data.weight,
        };

        setPokemonDetail(details);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [name]);

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!name) return;

    const currentIndex = pokemonList.indexOf(name);
    let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0) newIndex = pokemonList.length - 1;
    if (newIndex >= pokemonList.length) newIndex = 0;

    navigate(`/details/${pokemonList[newIndex]}`);
  };

  if (loading) {
    return <p>Loading Pokémon details...</p>;
  }

  if (!pokemonDetail) {
    return <p>Pokémon not found</p>;
  }

  return (
    <div className="pokemon-detail-container">
      <h1>{pokemonDetail.name.charAt(0).toUpperCase() + pokemonDetail.name.slice(1)}</h1>
      <img src={pokemonDetail.image} alt={pokemonDetail.name} className="pokemon-image" />

      <div>
        <h3>Types</h3>
        <p>{pokemonDetail.types.join(', ')}</p>
      </div>

      <div>
        <h3>Abilities</h3>
        <p>{pokemonDetail.abilities.join(', ')}</p>
      </div>

      <div>
        <h3>Stats</h3>
        <div className="stats-container">
          {pokemonDetail.stats.map((stat) => (
            <div key={stat.name} className="stat-item">
              <span>{stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}: </span>
              <div className="stat-bar" style={{ width: `${(stat.base_stat / 255) * 100}%` }}>
                <span className="stat-bar-label">{stat.base_stat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3>Height</h3>
        <p>{pokemonDetail.height / 10} meters</p> 
      </div>

      <div>
        <h3>Weight</h3>
        <p>{pokemonDetail.weight / 10} kg</p>
      </div>

      <div className="navigation-buttons">
        <button onClick={() => handleNavigate('prev')}>&lt; Prev</button>
        <button onClick={() => handleNavigate('next')}>Next &gt;</button>
      </div>
    </div>
  );
};

export default DetailView;
