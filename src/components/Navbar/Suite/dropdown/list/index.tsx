import styles from "./styles.module.css";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import logo_agents from "../../assets/logo_agents.svg";
import logo_dashboard from "../../assets/logo_dashboard.svg";
import logo_skinxpert from "../../assets/logo_skinxpert.svg";
import logo_uibox from "../../assets/logo_uibox.svg";
import logo_uitool from "../../assets/logo_uitool.png";
import logo_uitrade from "../../assets/logo_uitrade.png";
import logo_notimation from "../../assets/logo_notimation.svg";
import logo_small from "../../assets/logo_small.png";

interface IDropdownData {
  id: number;
  img: StaticImageData;
  title: string;
  route?: string;
  width?: number;
}

interface Props {
  app: string;
}

enum Colors {
  uitool_list_bg = "#272727",
  uitool_data_hover = "datatool",
  uitrade_list_bg = "#FFFFFF",
  uitrade_data_hover = "dataTrade",
  dashboard_list_bg = "#F1F1F1",
}
export const devUrls = {
  small: "https://panel.small.ar",
  uitool: "https://uitool.com",
  uitrade: "https://uitrade.com",
  inbox: "https://inbox.notimation.com",
  notimation_dashboard: "#",
  xpert: "#",
  uibox: "https://uibox.app",
};

const prodUrls = {
  small: "https://panel.small.ar",
  uitool: "https://uitool.com",
  uitrade: "https://uitrade.com",
  inbox: "https://inbox.notimation.com",
  notimation_dashboard: "#",
  xpert: "#",
  uibox: "https://uibox.app",
};

const environment = process.env.VERCEL_ENV;
const selectedUrls = environment === "development" ? devUrls : prodUrls;

export const List = ({ app }: Props) => {
  const data: IDropdownData[] = [
    {
      id: 1,
      img: logo_small,
      title: "Small",
      route: selectedUrls.small,
    },
    {
      id: 2,
      img: logo_uitool,
      title: "Tool",
      route: selectedUrls.uitool,
    },
    {
      id: 3,
      img: logo_uitrade,
      title: "Trade",
      route: selectedUrls.uitrade,
    },
    {
      id: 5,
      img: logo_agents,
      title: "Inbox",
      route: selectedUrls.inbox,
    },
    {
      id: 4,
      img: logo_skinxpert,
      title: "Pert",
      route: selectedUrls.xpert,
    },
    {
      id: 6,
      img: logo_dashboard,
      title: "Dashboard",
      route: selectedUrls.notimation_dashboard,
    },
    {
      id: 7,
      img: logo_uibox,
      title: "Box",
      route: selectedUrls.uibox,
    },
  ];

  /* Condicional para cambiar estilos de la lista*/
  let change_svg: boolean = false;
  let list_bg: string;
  //let data_hover: string;
  if (app === "uitool" || app === "sxpert") {
    change_svg = true;
    list_bg = Colors.uitool_list_bg;
    //data_hover = Colors.uitool_data_hover;
  } else if (app === "uitrade") {
    list_bg = Colors.uitrade_list_bg;
    // data_hover = "dataTrade";
  } else {
    list_bg = Colors.dashboard_list_bg;
  }

  return (
    <div className={styles.container}>
      <ul className={styles.list_content} style={{ background: list_bg }}>
        {data.map((item, index) => (
          <a
            href={item.route}
            target='_blank'
            className={`${styles.data} ${app === "uitrade" ? `${styles.dataTrade}` : `${styles.dataDashboard}`} ${
              change_svg && styles.dataTool
            }`}
            key={index}
          >
            <Image
              src={item.img}
              className={`${
                item.title === "Small" || item.title === "Trade" || item.title === "Tool" ? styles.png : ""
              }  ${item.id > 4 && change_svg && styles.white_svgs}`}
              alt={item.title}
            />
            <p className={change_svg ? styles.textuitool : styles.text}>{item.title}</p>
          </a>
        ))}
      </ul>
      <Link
        href={"https://notimation.com/"}
        target='_blank'
        className={styles.list_footer}
        style={{ background: list_bg }}
      >
        <Image
          src={logo_notimation}
          className={`${change_svg ? styles.notimation_white : styles.img}`}
          alt={"Logo Notimation"}
        />
      </Link>
    </div>
  );
};
