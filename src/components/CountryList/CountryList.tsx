import { useEffect, useState } from "react";
import styles from "./CountryList.module.scss";
import axios from "axios";
import ExpandedCountry from "../ExpandedCountry/ExpandedCountry";
import SearchBar from "../SearchBar/SearchBar";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";
import LoadMore from "../LoadMore/LoadMore";

type Languages = {
  name: string;
};

export type Country = {
  capital: string;
  code: string;
  currency: string;
  languages: Languages[];
  name: string;
  native: string;
  phone: string;
};

export default function CountrList() {
  const endpoint = "https://countries.trevorblades.com/";
  const headers = {
    "content-type": "application/json",
  };
  const graphqlQuery = {
    query: `{ 
      countries {
        name
        code
      }
    }`,
  };

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countriesExpanded, setCountriesExpanded] = useState<string[]>([]);
  const [foundCountries, setFoundCountries] = useState<Country[]>();
  const [nothingFound, setNothingFound] = useState(false);
  const [loadAmount, setLoadAmount] = useState(20);

  useEffect(() => {
    setLoading(true);

    axios({
      url: endpoint,
      method: "post",
      headers: headers,
      data: graphqlQuery,
    })
      .then(({ data }) => {
        setCountries(data.data.countries);
        setLoading(false);
      })
      .catch(({ message }) => {
        setLoading(false);
        setError(true);
        setErrorMessage(message);
      });
  }, []);

  // Add/remove country code to/from expanded country array
  const onCountryExpand = (code: string) => {
    if (countriesExpanded.includes(code)) {
      const filtereCountries = countriesExpanded.filter(
        (countryCode) => countryCode !== code
      );
      setCountriesExpanded([...filtereCountries]);

      return;
    }

    setCountriesExpanded([...countriesExpanded, code]);
  };

  // Show loading if fetching data
  if (loading) {
    return <Loading />;
  }

  // Show error if there is an error
  if (error) {
    return <Error />;
  }

  // Return list of countries
  return (
    <>
      <SearchBar
        setFoundCountries={setFoundCountries}
        countries={countries}
        foundCountries={foundCountries}
        setNothingFound={setNothingFound}
        setCountriesExpanded={setCountriesExpanded}
        setLoadAmount={setLoadAmount}
      />
      <div className={styles.countries_container}>
        {nothingFound && <span>No matching results found.</span>}

        {(foundCountries ? foundCountries : countries)
          .slice(0, loadAmount)
          .map((country) => (
            <div key={country.code} className={styles.country}>
              <span
                className={styles.country_name}
                onClick={() => onCountryExpand(country.code)}
              >
                {country.name} ({country.code})
                {countriesExpanded.includes(country.code) ? (
                  <span className={styles.arrow}>&#8679;</span>
                ) : (
                  <span className={styles.arrow}>&#8681;</span>
                )}
              </span>
              {countriesExpanded.includes(country.code) && (
                <ExpandedCountry countryCode={country.code} />
              )}
            </div>
          ))}
      </div>
      <LoadMore
        countries={countries}
        loadAmount={loadAmount}
        setLoadAmount={setLoadAmount}
        foundCountries={foundCountries}
      />
    </>
  );
}
