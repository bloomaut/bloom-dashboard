import React from "react";
import Icon from "../Icon";

interface Props {
  handleIndex: (operation: string) => void;
}

function Buttons({ handleIndex }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
      <div
        onClick={() => handleIndex("sub")}
        style={{
          width: "8rem",
          height: "2.5rem",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "30px",
          backgroundColor: "var(--color-primary)",
          paddingBlock: 10,
          paddingInline: 20,
          color: "var(--color-font-primary-dark, #ffffff)",
          fontSize: "0.8rem",
          gap: "0.8rem",
          cursor: "pointer",
        }}
      >
        <div style={{ paddingBottom: "0.1rem", userSelect: "none" }}>Atras</div>{" "}
      </div>
      <div
        onClick={() => handleIndex("add")}
        style={{
          width: "8rem",
          height: "2.5rem",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "30px",
          backgroundColor: "var(--color-primary)",
          paddingBlock: 10,
          paddingInline: 20,
          color: "white",
          fontSize: "0.8rem",
          gap: "0.8rem",
          cursor: "pointer",
        }}
      >
        <div style={{ paddingBottom: "0.1rem", userSelect: "none" }}>Siguiente</div>{" "}
        <Icon name='arrow_right' strokeColor='#ffffff' />
      </div>
    </div>
  );
}

export default Buttons;
