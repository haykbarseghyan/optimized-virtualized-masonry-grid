import { useState } from 'react';

import { SearchStyled } from '../Grid.styled';

const Search = ({ callback }: { callback: (value: string) => void }) => {
  const [query, setQuery] = useState<string>('');

  const handleSearch = () => {
    callback(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <SearchStyled
      style={{
        position: 'fixed',
      }}
    >
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Search</button>
    </SearchStyled>
  );
};

export default Search;
