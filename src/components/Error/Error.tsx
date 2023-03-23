import styles from "./Error.module.scss";

export default function Error() {
  return (
    <div className={styles.wrapper}>
      <span>Some error occured</span>
    </div>
  );
}
