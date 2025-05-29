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
  const [isFocused, setIsFocused] = useState(false);

  const highlightMatch = useCallback((text) => {
    if (!query) return text;
    
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return text;

    return (
      <>
        {text.slice(0, index)}
        <strong style={{ color: '#2563eb' }}>{text.slice(index, index + query.length)}</strong>
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      padding: '2rem',
      fontFamily: "'Inter', sans-serif",
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        textAlign: 'center'
      }}>
        {/* Header with logo and title */}
        <div style={{
          marginBottom: '3rem',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(5px)',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" 
                stroke="#2563eb" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M21 21L16.65 16.65" 
                stroke="#2563eb" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            color: '#1e293b',
            margin: '0.5rem 0',
            background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Search Pro</h1>
          <p style={{
            color: '#64748b',
            fontSize: '1.25rem',
            margin: '0.5rem 0 0',
            fontWeight: '500'
          }}>The fastest search experience</p>
        </div>

        {/* Search input */}
        <div style={{
          position: 'relative',
          marginBottom: '1rem',
          width: '100%',
          animation: 'slideUp 0.5s ease-out'
        }}>
          <input
            type="text"
            placeholder="Try searching for demo's thing..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              
              padding: '1.25rem 1.5rem 1.25rem 3.5rem',
              width: '100%',
              fontSize: '1.1rem',
              borderRadius: '50px',
              border: 'none',
              boxShadow: isFocused 
                ? '0 10px 25px -5px rgba(37, 99, 235, 0.3)' 
                : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(5px)' , color:'black'
            }}
          />
          <svg
            style={{
              position: 'absolute',
              left: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '1.5rem',
              height: '1.5rem',
              color: '#94a3b8',
              zIndex: 10
            }}
            xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M21 21L16.65 16.65" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
        </div>

        {/* Results dropdown */}
        {results.length > 0 && (
          <div style={{
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            marginTop: '1rem',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <ul style={{ 
              margin: 0, 
              padding: 0, 
              listStyle: 'none',
              maxHeight: '60vh',
              overflowY: 'auto'
            }}>
              {results.map(item => (
                <li 
                  key={item.id} 
                  style={{ 
                    padding: '1.25rem 2rem',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ':hover': {
                      background: 'rgba(37, 99, 235, 0.05)'
                    },
                    ':last-child': {
                      borderBottom: 'none'
                    }
                  }}
                >
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    color: '#1e293b'
                  }}>
                    {highlightMatch(item.name)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        {!query && (
          <div style={{
            marginTop: '3rem',
            color: '#64748b',
            fontSize: '0.9rem',
            animation: 'fadeIn 1s ease-out'
          }}>
            <p>Type to begin searching</p>
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;