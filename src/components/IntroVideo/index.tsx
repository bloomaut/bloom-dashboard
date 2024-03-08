import { useState, useEffect } from "react";

const IntroVideo = () => {
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(500);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1280) {
        setWidth(500);
        setHeight(400);
      } else {
        setWidth(700);
        setHeight(600);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <iframe
        width={width}
        height={height}
        src='https://www.youtube.com/embed/HdHaSAqO1I0'
        title='YouTube video player'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default IntroVideo;
