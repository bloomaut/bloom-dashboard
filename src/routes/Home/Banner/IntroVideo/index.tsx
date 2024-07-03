interface Props {
  height: string;
}
const IntroVideo = ({ height }: Props) => {
  return (
    <div>
      <iframe
        width='100%'
        height={height}
        src='https://www.youtube.com/embed/fijeAV5amv4'
        title='YouTube video player'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
        style={{ borderRadius: "5px", border: "none" }}
      ></iframe>
    </div>
  );
};

export default IntroVideo;
