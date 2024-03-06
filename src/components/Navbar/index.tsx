import styles from "./styles.module.scss";
import Image from "next/image";
import small from "@/../public/assets/Small.png";
import { Link } from "@/navigation";

const Navbar = () => {
  return (
    <nav className={styles.container}>
      <Link href='/'>
        <Image src={small} alt='Small' className={styles.logo} height={60} width={166} priority />
      </Link>
    </nav>
  );
};

export default Navbar;
