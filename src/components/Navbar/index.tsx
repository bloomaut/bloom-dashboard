import styles from "./styles.module.scss";
import Image from "next/image";
import { Link } from "@/navigation";

//Icons
import small from "@/../public/assets/Small.png";
import logo_knowledge from "@/../public/icons/KnowledgeIcon.png";
import LangDrop from "./LangDrop";

//Components

const Navbar = () => {
  return (
    <nav className={styles.container}>
      <Link href='/'>
        <Image src={small} alt='Small' className={styles.logo} height={60} width={166} priority />
      </Link>
      <div className={styles.inner_container}>
        {/* Knowledge */}
        <Link href='https://noti-knowledge.vercel.app/es/' target='_blank'>
          <div className={styles.knowledge}>
            <Image src={logo_knowledge} alt='Logo' priority width={26} height={22} className={styles.logo_knowledge} />
            <p className={styles.text_knowledge}>Knowledge</p>
          </div>
        </Link>

        <LangDrop />
        <Link href='/'>Icon</Link>
        <Link href='/'>User</Link>
      </div>
    </nav>
  );
};

export default Navbar;
