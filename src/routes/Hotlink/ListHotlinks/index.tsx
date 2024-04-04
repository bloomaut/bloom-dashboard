import styles from "./styles.module.scss";
import Search from "@/components/Search";
import { useClientsContext } from "@/context/ClientsContext";
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

  return (
    <div className={styles.container}>
      <div className={styles.title_container}>
        <p>Hotlink List</p>
        <Search
          searchValue={searchValue}
          handleSearchChange={e => setSearchValue(e.target.value)}
          placeholder='Search'
        />
      </div>
      {/* TABLA */}
      <div className={styles.table_container}>
        <h4>Diseño/Template</h4>
        <h4>Cliente</h4>
        <h4>Hotlink URL</h4>
        <h4>Compartir</h4>
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
