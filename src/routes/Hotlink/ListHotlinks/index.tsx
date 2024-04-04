import styles from "./styles.module.scss";
import { useClientsContext } from "@/context/ClientsContext";
import { useTranslations } from "next-intl";

import Search from "@/components/Search";
import TableRow from "./TableRow";

const data = [
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente 1", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  { nameHotlink: "Pedidos/ Hoh-cute-cocodrile", name: "Cliente", link: "power-app-engine.vercel.app/.....2a29d4" },
  {
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente ultimo",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
];

const ListHotlinks = () => {
  const { searchValue, setSearchValue } = useClientsContext();
  const dict = useTranslations("dict.hotlinks.list");

  return (
    <div className={styles.container}>
      <div className={styles.title_container}>
        <p>{dict("title")}</p>
        <Search
          searchValue={searchValue}
          handleSearchChange={e => setSearchValue(e.target.value)}
          placeholder={dict("search")}
        />
      </div>
      {/* TABLA */}
      <div className={styles.table_container}>
        <h4>{dict("title_one")}</h4>
        <h4>{dict("title_two")}</h4>
        <h4>{dict("title_three")}</h4>
        <h4>{dict("title_four")}</h4>
      </div>
      <div className={styles.rows_container}>
        {data.map(client => {
          return <TableRow data={client} />;
        })}
      </div>
    </div>
  );
};

export default ListHotlinks;
