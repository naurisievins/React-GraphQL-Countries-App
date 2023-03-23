import { useEffect, useState } from "react";
import styles from "./LoadMore.module.scss";
import { Country } from "../CountryList/CountryList";

type LoadMoreProps = {
  countries: Country[];
  loadAmount: number;
  setLoadAmount: Function;
  foundCountries: Country[] | undefined;
};

export default function LoadMore({
  countries,
  loadAmount,
  setLoadAmount,
  foundCountries,
}: LoadMoreProps) {
  const [disableLoadBtn, setDisableLoadBtn] = useState(false);

  useEffect(() => {
    if (foundCountries) {
      if (loadAmount >= foundCountries.length) {
        setDisableLoadBtn(true);
      }
    }

    if (loadAmount >= countries.length) {
      setDisableLoadBtn(true);
    }
  }, [loadAmount]);

  return (
    <div className={styles.load_more_wrapper}>
      <button
        className={styles.load_more_btn}
        onClick={() => setLoadAmount(loadAmount + 20)}
        disabled={disableLoadBtn}
      >
        {disableLoadBtn ? <span>All loaded</span> : <span>Load more</span>}
      </button>
    </div>
  );
}
