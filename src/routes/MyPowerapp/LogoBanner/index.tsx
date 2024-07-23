import Image from "next/image";
import styles from "./styles.module.scss";

interface Props {
  logo: string | null;
  banner: string | null;
}

const LogoBanner = ({ logo, banner }: Props) => {
  return (
    <section className={styles.logo_banner}>
      <div className={styles.border}>
        <h6>Logo</h6>
        <div className={styles.logo}>
          {logo && <Image src={logo ? logo : ""} alt='Logo' width={100} height={100} />}
        </div>
      </div>
      {banner && (
        <div className={styles.border}>
          <h6>Banner</h6>
          <div className={styles.banner}>
            <Image src={banner} alt='Banner' width={100} height={100} />
          </div>
        </div>
      )}
    </section>
  );
};

export default LogoBanner;
