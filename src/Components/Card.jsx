import React from "react";


const Card = ({ pokemon, loading,infoPokemon, deletePokemon }) => {
  const handleDelete = (id) => {
  
    const deletedPokemonData = JSON.parse(localStorage.getItem("deletedPokemonData")) || [];
    deletedPokemonData.push(id);
    localStorage.setItem("deletedPokemonData", JSON.stringify(deletedPokemonData));
    deletePokemon(id);
  };
  return (
    <div className="card-container">
    {loading ? (
      <h1>Loading...</h1>
    ) : (
      pokemon.map((item) => (
        <div className="card" key={item.id}>
          <h2>{item.id}</h2>
          <img src={item.sprites.front_default} alt={item.name} />
          <h2>{item.name}</h2>
          <button className="dfgdgd" onClick={() => infoPokemon(item)}>Read More</button>
          <button className="fdfd" o onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      ))
    )}
  </div>
  );
};

export default Card;
