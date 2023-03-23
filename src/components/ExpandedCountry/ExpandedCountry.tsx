import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./ExpandedCountry.module.scss";
import { Country } from "../CountryList/CountryList";

type ExpandedCountryProps = {
  countryCode: string;
};

export default function ExpandedCountry({ countryCode }: ExpandedCountryProps) {
  const endpoint = "https://countries.trevorblades.com/";
  const headers = {
    "content-type": "application/json",
  };
  const graphqlQuery = {
    query: `{
      country(code: "${countryCode}") {
        capital
        code
        currency
        native
        phone
        languages { name }
      }
    }`,
  };

  const [country, setCountry] = useState<Country>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true);

    axios({
      url: endpoint,
      method: "post",
      headers: headers,
      data: graphqlQuery,
    })
      .then(({ data }) => {
        setCountry(data.data.country);
        setLoading(false);
      })
      .catch(({ message }) => {
        setLoading(false);
        setError(true);
        setErrorMessage(message);
      });
  }, []);

  // Show loading if fetching data
  if (loading) {
    return <span className={styles.loading}>Loading...</span>;
  }

  // Show error if there is an error
  if (error) {
    return <span className={styles.error}>{errorMessage}</span>;
  }

  return (
    <div className={styles.countries_container}>
      {country && (
        <div key={country.code} className={styles.country}>
          <div className={styles.country_container}>
            <span>Capital: {country.capital}</span>
            <span>Country code: {country.code}</span>
            <span>Currency: {country.currency}</span>
            <span>Native: {country.native}</span>
            <span>Phone code: +{country.phone}</span>
            <span>
              Languages:{" "}
              {country.languages.map((language, index) => (
                <span key={language.name}>
                  {language.name}
                  {country.languages.length &&
                    index < country.languages.length - 1 && <span>, </span>}
                </span>
              ))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
