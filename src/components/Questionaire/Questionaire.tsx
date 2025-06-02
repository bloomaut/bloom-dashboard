import { get, getQuest, postExcel, postQuest } from "@/services/fetch";
import { setDataRicardos } from "@/store/features/ricardoSlice";
import { setDataSubdomains } from "@/store/features/subdomainsSlice";
import { setUserData } from "@/store/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setQuestData, updateQuestData } from "@/store/questSlice";
import React, { useEffect } from "react";

function Questionaire() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userData);
  const questData = useAppSelector(state => state.questData);
  const handleCreate = async () => {
    const data = await postQuest(questData);
  };
  const { clientId } = useAppSelector(state => state.ricardosData);
  const getData = async () => {
    const resUser = await get("user/me");
    if (resUser.statusCode === 200) {
      dispatch(setUserData(resUser.result.user));
    }
    const resRichards = await get("client-permissions/role");
    if (resRichards.statusCode === 200) {
      dispatch(setDataRicardos(resRichards.result.clients.ricardos));
    }
    const resSubdomains = await get("subdomains");
    if (resSubdomains.statusCode === 200) {
      dispatch(setDataSubdomains(resSubdomains.result.subdomains));
    }
  };

  useEffect(() => {
    getData();
  }, [clientId]);

  useEffect(() => {
    const handleGet = async () => {
      console.log(user);

      const data = await getQuest(user.id!);
      console.log(data);
      if (data.message === "No user found") {
        const newData = { userId: String(user.id), answers: ["", ""], completed: false };
        postQuest(newData);
        dispatch(setQuestData(newData));
      } else {
        dispatch(setQuestData(data));
      }

      console.error("Error fetching quest data");
    };
    handleGet();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    dispatch(updateQuestData({ index, data: e?.target?.value }));
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "3rem", justifyContent: "center", alignItems: "center" }}
    >
      <div>Questionaire</div>
      {questData.answers &&
        questData.answers.map((elem, index) => {
          return <input type='text' onChange={e => handleChange(e, index)} />;
        })}

      <button onClick={handleCreate}>User Create</button>
      <button onClick={() => console.log(questData, user)}>Info</button>
    </div>
  );
}

export default Questionaire;
