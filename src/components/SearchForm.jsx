import React, { useState } from 'react';

export default function SearchForm({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query); // Pass the search query to the parent component
    };

    return (
        <form onSubmit={handleSubmit} className='flex gap-4'>
            <label htmlFor="query">Busca tu vídeo:</label>
            <input
                id="query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué video quieres dibujar?"
                className='border border-slate-400 border-solid rounded-md px-2'
            />
            <button type="submit">Search</button>
        </form>
    );
};
