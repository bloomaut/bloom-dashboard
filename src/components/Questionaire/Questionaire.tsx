import { get, getQuest, postQuest } from "@/services/fetch";
import { setDataRicardos } from "@/store/features/ricardoSlice";
import { setDataSubdomains } from "@/store/features/subdomainsSlice";
import { setUserData } from "@/store/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFirstQuestData, setQuestCompleted, setQuestData, setQuestTerms, updateQuestData } from "@/store/questSlice";
import React, { useEffect, useState } from "react";
import Terms from "./Terms";
import QuestForm from "./QuestForm";
import Fin from "./Fin";
import Proposal from "./Proposal";
import { answers, generatePayload, questions } from "./questions";
import { CircleLoader } from "./Spinner";

export interface QuestData {
  userId: string;
  answers: string[];
  terms: boolean;
  completed: boolean;
}

function Questionaire() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userData);
  const questData = useAppSelector(state => state.questData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [empty, setEmpty] = useState(false);

  const [tab, setTab] = useState("loading");

  const { id } = useAppSelector(state => state.userData.client);

  const getData = async () => {
    const resUser = await get("user/me");
    if (resUser.statusCode === 200) {
      console.log(resUser.result);
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
  }, [id]);

  useEffect(() => {
    const handleGet = async () => {
      if (user.client.id === null || !user.client.id) return;
      console.log(user.id);
      const data = await getQuest(user.client.id);
      if (data.message === "No user found" || !data) {
        console.log("no esta");
        const newData = {
          userId: String(user.client.id),
          answers: answers,
          terms: false,
          completed: false,
          prop: false,
        };
        //postQuest(newData);
        dispatch(setFirstQuestData(newData));
        setTab("terms");
      } else {
        console.log("esta");
        dispatch(setQuestData(data));
        if (!data[0].terms) {
          setTab("terms");
        } else if (!data[0].completed) {
          setTab("quest");
        } else if (!user.client.proposal_url) {
          setTab("fin");
        } else {
          setTab("prop");
        }
      }

      console.error("Error fetching quest data");
    };
    handleGet();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    setEmpty(false);
    dispatch(updateQuestData({ index, data: e?.target?.value }));
  };

  const handleTerms = () => {
    console.log("terms");
    setTab("quest");
    dispatch(setQuestTerms(true));
  };

  const handleUpdate = () => {
    console.log("update", questData);
    const data = generatePayload(questData);
    postQuest({
      userId: questData.userId,
      answers: data,
      terms: questData.terms,
      completed: currentIndex === 104 ? true : questData.completed,
      prop: questData.prop,
    });
    dispatch(
      setQuestData({
        userId: questData.userId,
        answers: data,
        terms: questData.terms,
        completed: currentIndex === 104 ? true : questData.completed,
        prop: questData.prop,
      }),
    );
  };

  const handleIndex = (operation: string) => {
    if (currentIndex === 104) {
      console.log("completed");
      dispatch(setQuestCompleted(true));
      setTimeout(() => {
        handleUpdate();
        setTab("fin");
      }, 2000);
    }
    if (operation === "add") {
      if (currentIndex === questData.answers.length - 1) return;
      else {
        if (!questData.answers[currentIndex]) {
          setEmpty(true);
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      }
    }

    handleUpdate();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "3rem",
        width: "95%",
        height: "100%",
        paddingTop: "1rem",
      }}
    >
      {/* {questData.terms ? (
        <QuestForm
          handleChange={handleChange}
          handleIndex={handleIndex}
          questData={questData}
          currentIndex={currentIndex}
        />
      ) : (
        <Terms handleTerms={handleTerms} />
      )} */}
      {tab === "loading" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
          <CircleLoader />
        </div>
      )}
      {tab === "quest" && (
        <QuestForm
          handleChange={handleChange}
          handleIndex={handleIndex}
          questData={questData}
          currentIndex={currentIndex}
          setIndex={setCurrentIndex}
          empty={empty}
        />
      )}
      {tab === "terms" && <Terms handleTerms={handleTerms} />}
      {tab === "fin" && <Fin setTab={setTab} questData={questData} />}
      {tab === "prop" && <Proposal />}
      <div
        style={{ position: "absolute", left: "3%", bottom: "3%", display: "flex", flexDirection: "row", gap: "1.5rem" }}
      >
        <button
          onClick={() => setCurrentIndex(0)}
          style={{
            padding: "0.5rem",
            cursor: "pointer",
            backgroundColor: "#ff5722",
            borderRadius: "5px",
            color: "white",
          }}
        >
          Reiniciar
        </button>
        {/* <button
          style={{
            padding: "0.5rem",
            cursor: "pointer",
            backgroundColor: "#ff5722",
            borderRadius: "5px",
            color: "white",
          }}
          onClick={() => setTab("terms")}
        >
          Terms
        </button>
        <button
          style={{
            padding: "0.5rem",
            cursor: "pointer",
            backgroundColor: "#ff5722",
            borderRadius: "5px",
            color: "white",
          }}
          onClick={() => setTab("quest")}
        >
          Quest
        </button>
        <button
          style={{
            padding: "0.5rem",
            cursor: "pointer",
            backgroundColor: "#ff5722",
            borderRadius: "5px",
            color: "white",
          }}
          onClick={() => setTab("fin")}
        >
          Fin
        </button>
        <button
          style={{
            padding: "0.5rem",
            cursor: "pointer",
            backgroundColor: "#ff5722",
            borderRadius: "5px",
            color: "white",
          }}
          onClick={() => setTab("prop")}
        >
          Propuesta
        </button> */}
      </div>
    </div>
  );
}

export default Questionaire;
