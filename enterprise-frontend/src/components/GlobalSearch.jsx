import React, { useState } from 'react';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Connects cleanly with the multi-field scan architecture we configured on the backend
      const response = await fetch(`http://localhost:5000/api/employees/search?query=${encodeURIComponent(query)}`);
      const payload = await response.json();
      if (payload.success) {
        setResults(payload.data);
      }
    } catch (error) {
      console.error("Omni search resolution error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Scan across Name, Email, or Skill matrices..."
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          {loading ? 'Scanning...' : 'Search'}
        </button>
      </form>

      {/* Results View Panel */}
      <div className="search-results">
        {results.length > 0 ? (
          results.map((item, idx) => (
            <div key={idx} style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
              <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '14px' }}>{item.email}</p>
              <div style={{ fontSize: '12px', color: '#3b82f6' }}>Tags: {item.skills || 'General Staff'}</div>
            </div>
          ))
        ) : (
          !loading && <p style={{ textAlign: 'center', color: '#94a3b8' }}>No records scanned yet. Try typing a criteria identifier.</p>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;