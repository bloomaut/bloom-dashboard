import { useState, useEffect } from "react";

const IntroVideo = () => {
  const [height, setHeight] = useState(500);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1399) {
        setHeight(400);
      } else {
        setHeight(500);
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
        width='100%'
        height={height}
        src='https://www.youtube.com/embed/fijeAV5amv4'
        title='YouTube video player'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default IntroVideo;
