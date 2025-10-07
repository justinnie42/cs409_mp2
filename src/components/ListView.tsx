import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Pokemon {
  name: string;
  url: string;
  id: number;
}

const ListView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [sortedList, setSortedList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const pokemonWithIds = await Promise.all(
          response.data.results.map(async (pokemon: Pokemon) => {
            const id = parseInt(pokemon.url.split('/')[6]);
            return { ...pokemon, id };
          })
        );
        setPokemonList(pokemonWithIds);
        setSortedList(pokemonWithIds);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const filteredList = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSortedList(filteredList);
  };

  const handleSort = (property: 'name' | 'id', direction: 'asc' | 'desc') => {
    const sorted = [...sortedList].sort((a, b) => {
      if (property === 'name') {
        if (direction === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      } else if (property === 'id') {
        if (direction === 'asc') {
          return a.id - b.id;
        } else {
          return b.id - a.id;
        }
      }
      return 0;
    });
    setSortedList(sorted);
  };

  return (
    <div className="list-view-container">
      <h1>Pokémon List</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search for a Pokémon..."
        className="search-bar"
      />

      <div className="sorting-buttons">
        <button onClick={() => handleSort('name', 'asc')}>Sort by Name A-Z</button>
        <button onClick={() => handleSort('name', 'desc')}>Sort by Name Z-A</button>
        <button onClick={() => handleSort('id', 'asc')}>Sort by ID (Asc)</button>
        <button onClick={() => handleSort('id', 'desc')}>Sort by ID (Desc)</button>
      </div>
        <div className="sorting-buttons">
            <Link to="/gallery">
            <button>Gallery</button>
            </Link>
        </div>

      {loading ? (
        <p>Loading Pokémon...</p>
      ) : (
        <div className="pokemon-list">
          {sortedList.length > 0 ? (
            sortedList.map((pokemon) => (
              <div key={pokemon.name} className="pokemon-item">
                <Link to={`/details/${pokemon.name}`}>{pokemon.name}</Link>
              </div>
            ))
          ) : (
            <p>No Pokémon found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ListView;
