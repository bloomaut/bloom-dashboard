import Button from "@/components/Button";
import styles from "./styles.module.scss";
import Icon from "@/components/Icon";
import { DatasetProps } from "@/typescript/interfaces/catalog.interface";
import { useState } from "react";
import { useCatalogContext } from "@/context/CatalogContext";
import { Link } from "@/navigation";
import Image from "next/image";
import FormActions from "../FormActions";

const Card = ({ _id, name, description, image, visibility, totalDataItems }: DatasetProps) => {
  const { fetchDatasets } = useCatalogContext();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <article className={styles.container}>
      <div className={styles.card}>
        <Link href={`${_id === "1" ? "all-products" : `/catalog/${_id}`}`} className={styles.image_container}>
          {image ? (
            <Image src={image} className={styles.image} alt={name} width={140} height={140} />
          ) : (
            _id !== "1" && (
              <div className={styles.icon_container}>
                <Icon
                  name='dataset'
                  width={50}
                  height={50}
                  strokeWidth={1.3}
                  strokeColor={"#BEBEBE"}
                  viewBox='0 0 25 24'
                />
              </div>
            )
          )}
        </Link>
        <Link href={`${_id === "1" ? "all-products" : `/catalog/${_id}`}`} className={styles.content}>
          <div className={styles.title_container}>
            <h2 className={styles.title} title={name}>
              {name}
            </h2>
            <span>({totalDataItems})</span>
          </div>
        </Link>
        {showPopup && (
          <FormActions
            action='put'
            id={_id}
            name={name}
            description={description}
            image={image}
            visibility={visibility}
            fetchDatasets={fetchDatasets}
            setShowConfirmation={setShowPopup}
          />
        )}
      </div>
      {_id !== "1" && (
        <div className={styles.btn_edit}>
          <Button
            styleName='bg_transparent'
            icon={<Icon name='edit' width={25} height={25} strokeWidth={1.3} strokeColor='#fff' viewBox='0 0 20 22' />}
            onclick={() => setShowPopup(true)}
          />
        </div>
      )}
    </article>
  );
};

export default Card;
