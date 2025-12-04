import styles from '../../../styles/digitalhiringapp.module.css';

export function PoweredByLogo() {
  return (
    <div className={styles.poweredByContainer}>
      <span>Powered by</span>
      <div className={styles.poweredByLogo}>
        <img
          src="/img/driverfly-logo-square.png"
          alt="DriverFly"
        />
      </div>
    </div>
  );
}
