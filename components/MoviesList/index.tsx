import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles/index.module.scss";
import { fetchMoviesList } from "../../apis/getMoviesList";

const DEBOUNCED_TIME = 300; // in ms

function MoviesList({ query }) {
  const [movies, setMovies] = useState([]);

  // Debounce to reduce number of network calls
  const debounce = (callback, debounceTime) => {
    let timer;

    return (newValue) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback(newValue);
      }, debounceTime);
    };
  };

  // Fetch movies 
  const getMovies = (query) => {
    fetchMoviesList(query).then(
      (res) => {
        console.log(res?.results);
        setMovies(res?.results);
      },
      (error) => {
        console.log(error);
        setMovies([]);
      }
    );
  };

  const debouncedGetMovies = useCallback(
    debounce(getMovies, DEBOUNCED_TIME),
    []
  );

  useEffect(() => {
    debouncedGetMovies(query);
  }, [query]);

  return (
    <div className={styles.container}>
      {movies?.length > 0 && <div className={styles.search__container}>Total {movies?.length} movies found.</div>}
      <div  >
        
      {movies?.map(({ id, title, vote_average, vote_count, backdrop_path }) => {
        return (
          <Link href={`/details/${id}`}>
            <a>
              <div className={styles.row}>
                <Image
                  src={`https://image.tmdb.org/t/p/original${backdrop_path}?api_key=4cb1eeab94f45affe2536f2c684a5c9e`}
                  alt={title}
                  width="60"
                  height="60"
                />
                <p className={styles.title}>
                  {title} - rating - {vote_average} - total votes: {vote_count}
                </p>
              </div>
            </a>
          </Link>
        );
      })}
      </div>
    </div>
  );
}

export default MoviesList;
