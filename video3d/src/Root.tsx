import { Composition } from "remotion";
import timing from "./timing.json";
import { WorryVideo } from "./WorryVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Worry3am" component={WorryVideo} durationInFrames={timing.total} fps={timing.fps} width={1080} height={1920} />
    </>
  );
};
