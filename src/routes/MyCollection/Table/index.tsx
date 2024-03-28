import TableRow from "../TableRow";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";

const data = [
  { name: "Cliente 1", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { name: "Cliente ultimo", link: "power-app-engine.vercel.app/.....2a29d4" },
];

const Table = () => {
  const dict = useTranslations("dict.my-collection");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.column}>
          <p>{dict("clients")}</p>
        </div>
        <div className={styles.column}>
          <p>Link</p>
        </div>
        <div className={styles.column}>
          <p>{dict("share")}</p>
        </div>
      </div>
      <div className={styles.rows_container}>
        {data.map(client => {
          return <TableRow data={client} />;
        })}
      </div>
    </div>
  );
};

export default Table;
