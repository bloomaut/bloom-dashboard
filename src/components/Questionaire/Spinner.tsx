import React from "react";

export const CircleLoader = ({ size = 60, dotCount = 12, color = "#ff6b35" }) => {
  const dots = Array.from({ length: dotCount }, (_, i) => {
    const angle = (i * 360) / dotCount;
    const delay = i * 0.1;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: color,
          top: "50%",
          left: "50%",
          transform: `
            translate(-50%, -50%) 
            rotate(${angle}deg) 
            translateY(-${size / 2 - 2}px)
          `,
          animation: `fadeInOut 1.2s ease-in-out infinite`,
          animationDelay: `${delay}s`,
        }}
      />
    );
  });

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        {dots}
        <style jsx>{`
          @keyframes fadeInOut {
            0%,
            80%,
            100% {
              opacity: 0.2;
            }
            40% {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
};
