// components/SearchUserInput.tsx
import { useState, useEffect, useRef } from "react";
import useFetch from "../hooks/useFetch"

interface SearchUserInputProps {
  placeholder?: string;
  onSelect: (item: string) => void;
}

interface SimpleUser {
  id?: int
  name?: string
  username?: string
}

export default function SearchUserInput({ placeholder = "Search...", onSelect }: SearchUserInputProps) {

  const [inputSearch, setInputSearch] = useState("");
  const [results, setResults] = useState<SimpleUser[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const searchQuery = inputSearch ? `?search=${encodeURIComponent(inputSearch)}` : "";

  const { data, fetchData } = useFetch(
    'http://localhost:8000/user/get', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  },
  searchQuery)


  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (inputSearch.trim() === "") {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      await fetchData();
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputSearch]);

  useEffect(() => {
    if (data) {
      // console.log("entrei no useEffect do setResults")
      setResults(data);
      setShowDropdown(true);
      // console.log("finalizei no useEffect do setResults")
    }
  }, [data])


  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder={placeholder}
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
        onFocus={() => inputSearch && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // allow click to register
      />

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-md">
          {results.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(item);
                setShowDropdown(false);
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
