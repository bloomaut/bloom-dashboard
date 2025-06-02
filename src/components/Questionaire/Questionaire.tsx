import { getQuest, postExcel, postQuest } from "@/services/fetch";
import { useAppSelector } from "@/store/hooks";
import React from "react";

function Questionaire() {
  const user = useAppSelector(state => state.userData);
  const handleCreate = async () => {
    const data = await postQuest();
  };
  const handleGet = async () => {
    const data = await getQuest();
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "3rem", justifyContent: "center", alignItems: "center" }}
    >
      <div>Questionaire</div>
      <button onClick={handleCreate}>User Create</button>
      <button onClick={handleGet}>User Info</button>
    </div>
  );
}

export default Questionaire;
