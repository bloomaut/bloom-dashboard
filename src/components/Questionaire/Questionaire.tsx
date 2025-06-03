import { get, getQuest, postQuest } from "@/services/fetch";
import { setDataRicardos } from "@/store/features/ricardoSlice";
import { setDataSubdomains } from "@/store/features/subdomainsSlice";
import { setUserData } from "@/store/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setQuestData, setQuestTerms, updateQuestData } from "@/store/questSlice";
import React, { useEffect, useState } from "react";
import Terms from "./Terms";
import Buttons from "./Buttons";

function Questionaire() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userData);
  const questData = useAppSelector(state => state.questData);
  const [currentIndex, setCurrentIndex] = useState(1);

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
      if (user.id === null || !user.id) return;
      console.log(user);

      const data = await getQuest(user.id);
      console.log(data);
      if (data.message === "No user found") {
        const newData = { userId: String(user.id), answers: ["", ""], terms: false, completed: false };
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

  const handleTerms = () => {
    console.log("terms");
    dispatch(setQuestTerms(true));
  };

  const handleUpdate = () => {
    postQuest({ userId: String(user.id), answers: ["1", "2", "3", "4", "5"], terms: false, completed: false });
  };

  const handleIndex = (operation: string) => {
    if (operation === "add") {
      if (currentIndex === questData.answers.length - 1) return;
      else {
        setCurrentIndex(currentIndex + 1);
      }
    }
    if (operation === "sub") {
      if (currentIndex === 0) return;
      else {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "3rem",
        width: "45%",
        height: "100%",
      }}
    >
      {questData.terms ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {<input type='text' onChange={e => handleChange(e, currentIndex)} value={questData.answers[currentIndex]} />}

          <Buttons handleIndex={handleIndex} />
        </div>
      ) : (
        <Terms handleTerms={handleTerms} />
      )}
      <div style={{ position: "absolute", left: 0, top: "10%", display: "flex", flexDirection: "column", gap: "2rem" }}>
        <button onClick={handleUpdate}>User Update</button>
        <button onClick={() => dispatch(setQuestTerms(!questData.terms))}>Terms</button>
        <button onClick={() => console.log(currentIndex)}>Info</button>
      </div>
    </div>
  );
}

export default Questionaire;
