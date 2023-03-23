import { useEffect, useState } from "react";
import styles from "./SearchBar.module.scss";
import { Country } from "../CountryList/CountryList";

type SearchBarProps = {
  foundCountries: Country[] | undefined;
  setFoundCountries: Function;
  countries: Country[];
  setNothingFound: Function;
  setCountriesExpanded: Function;
  setLoadAmount: Function;
};

export default function SearchBar({
  setFoundCountries,
  countries,
  foundCountries,
  setNothingFound,
  setCountriesExpanded,
  setLoadAmount,
}: SearchBarProps) {
  const [searchFor, setSearchFor] = useState("");

  const onSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFor(event.target.value.toLowerCase());
    setLoadAmount(20);
  };

  const onClearSearchInput = () => {
    setSearchFor("");
    setCountriesExpanded([]);
    setLoadAmount(20);
  };

  useEffect(() => {
    setNothingFound(false);

    if (searchFor) {
      const filteredCountries = countries.filter((country) => {
        return country.name.toLowerCase().includes(searchFor);
      });

      setFoundCountries([...filteredCountries]);

      if (!filteredCountries.length) {
        setNothingFound(true);
      }
    } else {
      setFoundCountries();
    }
  }, [searchFor]);

  return (
    <div className={styles.search_container}>
      <label className={styles.label}>
        Find country:
        <div className={styles.input_wrapper}>
          <input
            className={styles.search_input}
            type="text"
            value={searchFor}
            placeholder="Latvia..."
            onChange={(event) => onSearchInput(event)}
          />
          <img
            className={styles.input_icon}
            src="https://img.icons8.com/material-two-tone/256/search.png"
          ></img>
          <div className={styles.reset_search} onClick={onClearSearchInput}>
            x
          </div>
        </div>
      </label>
      {!foundCountries && (
        <span className={styles.search_info}>
          Showing list of {countries.length} countries.
        </span>
      )}
      {foundCountries && foundCountries.length === 1 && (
        <span className={styles.search_info}>1 country found.</span>
      )}
      {foundCountries && foundCountries.length > 1 && (
        <span className={styles.search_info}>
          {foundCountries?.length} countries found.
        </span>
      )}
    </div>
  );
}
