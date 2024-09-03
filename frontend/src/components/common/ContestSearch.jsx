import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";

import { Button } from 'flowbite-react';
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function ContestSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchSearchResults = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/contest/search",
        { searchQuery }
      );
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Error searching for courses:", error);
      setSearchResults([]);
    }
  };
  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchSearchResults();
    console.log("Searching for Contest:", searchQuery);

    // Implement any additional search logic here if needed
  };

  return (
    <div className="mt-5">
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center rounded-lg bg-caribbeangreen-100 hover:bg-caribbeangreen-500
        text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <BiSearchAlt className="w-5 h-5 text-caribbeangreen-300 " />
        <span>Search</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 
            bg-gradient-to-r  bg-opacity-70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl rounded-lg shadow-lg bg-black"
            >
              <form onSubmit={handleSearch} className="flex items-center p-4">
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-l-lg border border-gray-300 text-white
                  bg-black py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button
                  type="submit"
                  className="flex items-center rounded-r-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <BiSearchAlt className="w-5 h-5 text-caribbeangreen-300" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="ml-4 text-white text-3xl"
                  aria-label="Close search"
                >
                  &times;
                </button>
              </form>

              {/* Search Results */}
              <div className="mt-4 max-h-96 w-auto overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.COURSE_ID}
                    className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-100"
                  >
                    {/* Image Section */}
                    {/* <div className="w-16 h-16 flex-shrink-0 mr-4">
                      <img
                        src={result.THUMBNAIL}
                        alt="Image"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div> */}

                    {/* Course Details Section */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-white">
                        {result.CONTESTNAME}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {result.CONTESTDESC}
                      </p>
                    </div>

                    {/* Price and Link Section */}
                    <div className="text-right ml-4">
                      <span className="block text-sm text-gray-500 mb-2">
                        {result.CONTESTTYPE}
                      </span>
                      <a
                        href={`/challenges/${result.CONTESTID}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Contest
                      </a>
                    </div>
                  </div>
                ))}
                {searchResults.length === 0 && searchQuery.trim() !== "" && (
                  <p className="p-4 text-gray-600">No results found.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
