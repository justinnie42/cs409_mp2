import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Pokemon {
  name: string;
  image: string;
  types: string[];
}

const GalleryView: React.FC = () => {
  const [pokemonImages, setPokemonImages] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const typesResponse = await axios.get('https://pokeapi.co/api/v2/type');
        const allTypes = typesResponse.data.results.map((type: { name: string }) => type.name);

        setTypes(allTypes);

        const pokemonResponse = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const pokemonWithImagesAndTypes = await Promise.all(
          pokemonResponse.data.results.map(async (pokemon: { name: string; url: string }) => {
            const res = await axios.get(pokemon.url);
            return {
              name: pokemon.name,
              image: res.data.sprites.front_default,
              types: res.data.types.map((type: { type: { name: string } }) => type.type.name),
            };
          })
        );

        setPokemonImages(pokemonWithImagesAndTypes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokémon data and types:', error);
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, []);

  const handleTypeFilterChange = (type: string) => {
    setSelectedTypes((prevSelectedTypes) => {
      if (prevSelectedTypes.includes(type)) {
        return prevSelectedTypes.filter((t) => t !== type);
      } else {
        return [...prevSelectedTypes, type];
      }
    });
  };

  const filteredPokemonImages = selectedTypes.length
    ? pokemonImages.filter((pokemon) =>
        selectedTypes.length === pokemon.types.length &&
        selectedTypes.every((type) => pokemon.types.includes(type))
      )
    : pokemonImages;

  return (
    <div className="gallery-view-container">
      <h1>Pokémon Gallery</h1>

      <div className="type-filter">
        <h3>Filter by Type</h3>
        <div className="type-checkboxes">
          {types.map((type) => (
            <label key={type} className="type-checkbox">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeFilterChange(type)}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading Pokémon images...</p>
      ) : (
        <div className="gallery">
          {filteredPokemonImages.length > 0 ? (
            filteredPokemonImages.map((pokemon) => (
              <div key={pokemon.name} className="pokemon-item">
                <Link to={`/details/${pokemon.name}`}>
                  <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
                  <p>{pokemon.name}</p>
                  <p>Types: {pokemon.types.join(', ')}</p>
                </Link>
              </div>
            ))
          ) : (
            <p>No Pokémon found with the selected types</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryView;
