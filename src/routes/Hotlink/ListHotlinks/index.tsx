import styles from "./styles.module.scss";
import { useClientsContext } from "@/context/ClientsContext";
import { useTranslations } from "next-intl";
import { useFlakesContext } from "@/context/FlakesContext";

import Search from "@/components/Search";
import TableRow from "./TableRow";
import Loading from "@/app/[locale]/(playground)/introduction/loading";

const data = [
  {
    id: 1,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente 1",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 2,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 3,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 4,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 5,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 6,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 7,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 8,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 9,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 10,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 11,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 12,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 13,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 14,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 15,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 16,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 17,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 18,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 19,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
  {
    id: 20,
    nameHotlink: "Pedidos/ Hoh-cute-cocodrile",
    name: "Cliente ultimo",
    link: "power-app-engine.vercel.app/.....2a29d4",
  },
];

const ListHotlinks = () => {
  const { searchValue, setSearchValue } = useClientsContext();
  const dict = useTranslations("dict.hotlinks.list");
  const { hotlinksList, filteredHotlinks, loading } = useFlakesContext();
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
        {loading ? (
          <Loading />
        ) : filteredHotlinks ? (
          <TableRow key={filteredHotlinks.id} hotlink={filteredHotlinks} />
        ) : (
          hotlinksList.map(hotlink => {
            return <TableRow key={hotlink.id} hotlink={hotlink} />;
          })
        )}
      </div>
    </div>
  );
};

export default ListHotlinks;
