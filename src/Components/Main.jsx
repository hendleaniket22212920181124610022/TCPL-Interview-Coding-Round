import React, { useState, useEffect } from "react";
import Card from "./Card";
import Pokeinfo from "./Pokeinfo";
import axios from "axios";

const Main = () => {
  const [pokeData, setPokeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedType, setEditedType] = useState("");
  const [editedData, setEditedData] = useState(null); 
  const [displayEditedData, setDisplayEditedData] = useState(false);

  const pokeFun = async () => {
    setLoading(true);
    const res = await axios.get(url);
    setNextUrl(res.data.next);
    setPrevUrl(res.data.previous);
    getPokemon(res.data.results);
    setLoading(false);
  };

  const getPokemon = async (res) => {
    const promises = res.map(async (item) => {
      const result = await axios.get(item.url);
      return result.data;
    });
    const pokemonData = await Promise.all(promises);
    setPokeData((prevState) => [...prevState, ...pokemonData]);
  };

  useEffect(() => {
    pokeFun();
  }, [url]);

  const handlePreviousClick = () => {
    if (prevUrl) {
      setPokeData([]);
      setUrl(prevUrl);
    }
  };

  const handleNextClick = () => {
    if (nextUrl) {
      setPokeData([]);
      setUrl(nextUrl);
    }
  };

  const handlePokemonClick = (poke) => {
    setSelectedPokemon(poke);
    setShowPopup(true);
    setEditMode(false);
    setDisplayEditedData(false); 
  };

  const handleClosePopup = () => {
    setSelectedPokemon(null);
    setShowPopup(false);
  };

  const deletePokemon = (id) => {
    setPokeData((prevState) => prevState.filter((pokemon) => pokemon.id !== id));
    const deletedPokemonData = JSON.parse(localStorage.getItem("deletedPokemonData")) || [];
    deletedPokemonData.push(id);
    localStorage.setItem("deletedPokemonData", JSON.stringify(deletedPokemonData));
  };

  const handleEditClick = () => {
    setEditMode(true);
    setEditedName(selectedPokemon.name);
    setEditedType(selectedPokemon.type);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedPokemon = {
      ...selectedPokemon,
      name: editedName,
      type: editedType,
    };

    const updatedPokeData = pokeData.map((pokemon) => {
      if (pokemon.id === selectedPokemon.id) {
        return updatedPokemon;
      }
      return pokemon;
    });

    setPokeData(updatedPokeData);
    setSelectedPokemon(updatedPokemon);
    setEditMode(false);
    setDisplayEditedData(true); 

    const updatedDataInLocalStorage = JSON.parse(localStorage.getItem("pokemonData")) || [];
    const index = updatedDataInLocalStorage.findIndex((pokemon) => pokemon.id === selectedPokemon.id);
    if (index !== -1) {
      updatedDataInLocalStorage[index] = updatedPokemon;
    }

    localStorage.setItem("pokemonData", JSON.stringify(updatedDataInLocalStorage));

    setEditedData(updatedPokemon);
  };

  useEffect(() => {
    const deletedPokemonData = JSON.parse(localStorage.getItem("deletedPokemonData")) || [];
  }, []);

  useEffect(() => {
    const editedPokemonData = JSON.parse(localStorage.getItem("pokemonData")) || [];
    setPokeData(editedPokemonData);
  }, []);

  const filteredPokemon = pokeData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container">
      <div className="left-content">
        <input
          type="text"
          className="filter-field"
          placeholder="Filter by name..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <Card
          pokemon={filteredPokemon}
          loading={loading}
          infoPokemon={(poke) => handlePokemonClick(poke)}
          deletePokemon={deletePokemon}
        />
               <div className="btn-group">
          <button onClick={handlePreviousClick} disabled={!prevUrl}>
            Previous
          </button>
          <button onClick={handleNextClick} disabled={!nextUrl}>
       Lode more 
          </button>
        </div>
        <div className="btn-group">
      
          </div>     
           </div>

      <div className="right-content">
        {showPopup && selectedPokemon && (
          <div className="popup-container">
            <div className="popup">
              {editMode ? (
                <form onSubmit={handleEditSubmit}>
                  <label>Name: </label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  <br />
                  <label>Type: </label>
                  <input
                    type="text"
                    value={editedType}
                    onChange={(e) => setEditedType(e.target.value)}
                  />
                  <br />
                  <button type="submit">Save</button>
                </form>
              ) : (
                <Pokeinfo data={selectedPokemon} />
              )}
              {displayEditedData && (
                <div>
                  <h3>Edited Data</h3>
                  <p>Name: {editedData.name}</p>
                  <p>Type: {editedData.type}</p>
                </div>
              )}
              <button onClick={handleClosePopup}>Close</button>
              <button onClick={handleEditClick}>Edit</button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Main;
