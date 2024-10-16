import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [modalData, setModalData] = useState(null);

  const getMovies = async () => {
    if (!search) {
      setErrors('Please enter a movie name');
      return;
    }

    setLoading(true);
    setErrors(null);

    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=45f0782a&s=${search}`);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setErrors('No movies found');
      }
    } catch (error) {
      setErrors('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (movie) => {
    setModalData(movie);
  };

  const closeModal = () => {
    setModalData(null);
  };

  return (
    <div className="app">
      {/* Search Bar */}
      <div className="search-section">
        <h1>Movie Search Engine</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter movie title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={getMovies} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {errors && <p className="error-message">{errors}</p>}
      </div>

      {/* Movies Grid */}
      <div className="movies-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.imdbID} className="movie-card" onClick={() => openModal(movie)}>
              <img src={movie.Poster} alt={movie.Title} />
              <div className="movie-info">
                <h3>{movie.Title}</h3>
                <p>{movie.Year}</p>
              </div>
            </div>
          ))
        ) : (
          !loading && <h2>No movies found</h2>
        )}
      </div>

      {/* Modal */}
      {modalData && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalData.Poster} alt={modalData.Title} />
            <h2>{modalData.Title}</h2>
            <p><strong>Year:</strong> {modalData.Year}</p>
            <p><strong>Genre:</strong> {modalData.Genre || 'N/A'}</p>
            <p><strong>Plot:</strong> {modalData.Plot || 'No plot available'}</p>
            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
