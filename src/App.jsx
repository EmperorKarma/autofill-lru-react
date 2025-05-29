import { useState, useEffect, useCallback } from 'react';
import LRUCache from './LRUCache';
import data from './data.json';

const cache = new LRUCache(10);
const preprocessedData = data.map(item => ({
  ...item,
  lowerName: item.name.toLowerCase()
}));

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const highlightMatch = useCallback((text) => {
    if (!query) return text;
    
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return text;

    return (
      <>
        {text.slice(0, index)}
        <strong>{text.slice(index, index + query.length)}</strong>
        {text.slice(index + query.length)}
      </>
    );
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = query.trim().toLowerCase();
      if (!trimmed) return setResults([]);

      const cached = cache.get(trimmed);
      if (cached) {
        setResults(prev => JSON.stringify(prev) === JSON.stringify(cached) ? prev : cached);
      } else {
        const filtered = preprocessedData
          .filter(item => item.lowerName.includes(trimmed))
          .slice(0, 10);
        cache.set(trimmed, filtered);
        setResults(prev => JSON.stringify(prev) === JSON.stringify(filtered) ? prev : filtered);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          padding: '0.5rem',
          width: '300px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />

      {results.length > 0 && (
        <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0 }}>
          {results.map(item => (
            <li key={item.id} style={{ padding: '4px 0' }}>
              {highlightMatch(item.name)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;