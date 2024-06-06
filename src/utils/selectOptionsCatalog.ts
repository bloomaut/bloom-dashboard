import { selectOptions } from "@/typescript/interfaces/catalog.interface";
import { useTranslations } from "next-intl";

export const SelectOptionsCatalog = (value: string) => {
  const dict = useTranslations("dict.catalog.select");

  const firstSelect: Array<selectOptions> = [
    { title: `${dict("option_one")}`, value: "download_post_template" },
    { title: `${dict("option_two")}`, value: "upload_post_excel" },
  ];

  const secondSelect: Array<selectOptions> = [
    { title: `${dict("option_three")}`, value: "download_update_template" },
    { title: `${dict("option_two")}`, value: "upload_update_excel" },
  ];

  if (value === "first") {
    return firstSelect;
  }
  return secondSelect;
};
