import { get, getQuest, postQuest } from "@/services/fetch";
import { setDataRicardos } from "@/store/features/ricardoSlice";
import { setDataSubdomains } from "@/store/features/subdomainsSlice";
import { setUserData } from "@/store/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFirstQuestData, setQuestCompleted, setQuestData, setQuestTerms, updateQuestData } from "@/store/questSlice";
import React, { use, useEffect, useState } from "react";
import Terms from "./Terms";
import QuestForm from "./QuestForm";
import Fin from "./Fin";
import Proposal from "./Proposal";
import { answers, generatePayload } from "./questions";
import { CircleLoader } from "./Spinner";
import WishList from "./WishList";

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
      const data = await getQuest(user.client.id);
      if (data.message === "No user found" || !data) {
        const newData = {
          userId: String(user.client.id),
          answers: answers,
          terms: false,
          completed: false,
          prop: false,
        };
        //postQuest(newData);
        dispatch(setFirstQuestData(newData));
        setTab("wishlist");
      } else {
        dispatch(setQuestData(data));
        /*  if (user.client.wish_list === true) {
          setTab("wishlist");
        } else */ if (!data[0].terms) {
          setTab("terms");
        } else if (!data[4].questions[4].answer) {
          setTab("quest");
        } else if (!user.client.proposal_url) {
          setTab("fin");
        } else {
          setTab("prop");
        }
      }
    };
    handleGet();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    setEmpty(false);
    dispatch(updateQuestData({ index, data: e?.target?.value }));
  };

  const handleTerms = () => {
    setTab("quest");
    dispatch(setQuestTerms(true));
  };

  const handleUpdate = () => {
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
    if (currentIndex === 27 && operation === "add") {
      handleUpdate();
      setTab("fin");
      return;
    }

    if (operation === "subtract") {
      if (currentIndex === 0) return;
      else {
        setCurrentIndex(currentIndex - 1);
      }
    }
    if (operation === "add") {
      if (currentIndex === questData.answers.length - 1) return;
      else {
        if (currentIndex === 23) {
          console.log(1);
          setCurrentIndex(24);
        }
        if (!questData.answers[currentIndex]) {
          console.log(2);
          setEmpty(true);
          setCurrentIndex(currentIndex + 1);
        } else {
          console.log(3);
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
      {tab === "loading" && (
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100vh" }}
        >
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
      {tab === "wishlist" && <WishList />}
      {tab === "terms" && <Terms handleTerms={handleTerms} />}
      {tab === "fin" && <Fin setTab={setTab} questData={questData} />}
      {tab === "prop" && <Proposal />}
      <div
        style={{ position: "absolute", left: "3%", bottom: "3%", display: "flex", flexDirection: "row", gap: "1.5rem" }}
      >
        {/*  {user.client.wish_list === false && (
          <button
            onClick={() => setCurrentIndex(0)}
            style={{
              padding: "0.5rem",
              cursor: "pointer",
              backgroundColor: "var(--color-primary)",
              borderRadius: "5px",
              color: "var(--color-font-primary-dark, #ffffff)",
            }}
          >
            Reiniciar
          </button>
        )} */}

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
