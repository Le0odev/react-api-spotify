import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Header from './navbar/Header'


const CLIENT_ID = "e51ab3862b0340e2926f1474db5ca4ca";
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";





const Track = ({ track }) => {
  return (
    <div className="track">
      <img src={track.album.images[0].url} alt="" />
      <div className="track-info">
        <div className="track-name">{track.name}</div>
        <div className="track-artist">{track.artists.map(artist => artist.name).join(', ')}</div>
      </div>
      <div className="track-player">
        <iframe
          src={`https://open.spotify.com/embed/track/${track.id}`}
          width="100%"
          height="80"
          frameBorder="0"
          allowtransparency="true"
          allow="encrypted-media"
        ></iframe>
      </div>
    </div>
  );
};



function App() {
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    const storedToken = window.localStorage.getItem("token");

    if (!storedToken && hash) {
      const newToken = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", newToken);
      setToken(newToken);
    } else {
      setToken(storedToken);
    }
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const searchTracks = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          q: searchKey,
          type: "track"
        }
      });
      setTracks(data.tracks?.items || []);
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
    }
  };

  return (
    <div className="App">
        
        <h1>REACT</h1>
        {token ?
          <form onSubmit={searchTracks}>
            <input type="text" placeholder="Search for tracks" onChange={e => setSearchKey(e.target.value)} />
            <button type="submit">Search</button>
          </form>
          : <h2>Please login</h2>
        }
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
          : <button onClick={logout}>Logout</button>}
        
       
          

        
        <div className="tracks">
          <h2 className='linha-espaço'>-----------------------------------------------------------------------</h2>
          <h2>Resultados para sua pesquisa:</h2>
          {tracks.map(track => (
            <Track key={track.id} track={track} />
          ))}
        </div>
      
    </div>
  );
}

export default App;
