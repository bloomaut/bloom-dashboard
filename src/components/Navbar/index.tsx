import styles from "./styles.module.scss";
import Image from "next/image";
import { Link } from "@/navigation";

//Icons
import small from "@/../public/assets/Small.png";
import logo_knowledge from "@/../public/icons/KnowledgeIcon.png";
import suiteIcon from "@/../public/icons/SuiteIcon.png";
//Components
import LangDrop from "./LangDrop";
import UserDrop from "./UserDrop";
import { Dropdown } from "./Suite/dropdown";

const Navbar = () => {
  return (
    <nav className={styles.container}>
      <Link href='/'>
        <Image src={small} alt='Small' className={styles.logo} width={103} height={47} priority />
      </Link>
      <div className={styles.inner_container}>
        {/* Knowledge */}
        <Link href='https://noti-knowledge.vercel.app/es/' target='_blank'>
          <div className={styles.knowledge}>
            <Image src={logo_knowledge} alt='Logo' priority width={20} height={20} className={styles.logo_knowledge} />
            <p className={styles.text_knowledge}>Knowledge</p>
          </div>
        </Link>
        <LangDrop />
        <Dropdown app='uitrade' />
        <UserDrop />
      </div>
    </nav>
  );
};

export default Navbar;
