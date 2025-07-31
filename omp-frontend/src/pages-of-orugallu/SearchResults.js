import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const q = query.get("q") || "";
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (!q) return;
    fetch(`http://localhost:5000/api/items?q=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => console.error("Search error", err));
  }, [q]);

  return (
    <div className="search-results-wrapper">
      <h2>🔍 Results for "{q}"</h2>
      {results.length === 0 ? (
        <p>No matching items found.</p>
      ) : (
        <ul>
          {results.map(item => (
            <li key={item.id}>
              <strong>{item.name}</strong> – ₹{item.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchResults;