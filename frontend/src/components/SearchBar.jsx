import { useState } from 'react';
import { searchUser } from '../api';
import { Link } from "react-router-dom";

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };
    
    const handleSearch = async () => {
        if (!query.trim()) return; // Prevent empty searches

        setLoading(true);

        try {
            const data = await searchUser(query);
            setResults(data || []);
        } catch (error) {
            console.error("Search error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input 
                type="text" 
                value={query} 
                onChange={handleInputChange} 
                placeholder="Search for a username..." 
            />
            <button onClick={handleSearch}>Search</button>

            {loading && <p>Loading...</p>}

            {results.length === 0 ? (
                <p>No users found</p>  // Show message if no results
            ) : (
                <ul>
                    {results.map((user) => (
                        <li key={user._id}>{user.firstName} {user.lastName} {' '}
                        <Link to={`/profile/${user._id}`}>View Profile</Link>
                        </li>  // Display user names
                    ))}
                </ul>
            )}

        </div>
    );
};

