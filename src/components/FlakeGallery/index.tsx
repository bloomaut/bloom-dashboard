import styles from "./styles.module.scss";
import Image from "next/image";
import Icon from "@/components/Icon";
import { Powerapp } from "@/typescript/interfaces/flakes.interface";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

interface Props {
  app: Powerapp;
  handleClick: (url: string, type: string) => void;
}

const FlakeGallery = ({ app, handleClick }: Props) => {
  return (
    <div className={styles.template_container} key={app._id}>
      <h4 className={styles.title}>{app.skinx.title}</h4>
      <div className={styles.template}>
        <div className={styles.sm_card} onClick={() => handleClick(app.hog_related.thumbnail, "hog")}>
          {app.hog_related.thumbnail ? (
            <Image src={app.hog_related.thumbnail} alt={app.skinx.title} width={167} height={120} />
          ) : (
            <Icon name='hog' width={40} height={40} fillColor='#7f7f7f' strokeColor='#7f7f7f' strokeWidth={0.5} />
          )}
        </div>
        <div className={styles.lg_card} onClick={() => handleClick(app.thumbnail, "powerapp")}>
          {app.thumbnail ? (
            <Zoom classDialog='custom-zoom'>
              <Image
                src={app.thumbnail}
                alt={app.skinx.title}
                className={styles.image}
                width={800}
                height={800}
                priority
              />
            </Zoom>
          ) : (
            <Icon
              name='pwa'
              width={80}
              height={80}
              fillColor='#7f7f7f'
              strokeColor='#7f7f7f'
              strokeWidth={0.1}
              viewBox='0 0 109 127'
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FlakeGallery;
