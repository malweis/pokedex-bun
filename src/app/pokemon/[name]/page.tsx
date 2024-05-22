import React from 'react'

const PokemonDetails = ({ params }: { params: { name: string } }) => {
  return (
    <div>{params.name}</div>
  )
}

export default PokemonDetails