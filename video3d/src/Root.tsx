import { Composition } from "remotion";
import timing from "./timing.json";
import tNoContact from "./timing/no_contact.json";
import tWorse from "./timing/worse_at_night.json";
import tAudience from "./timing/audience_of_one.json";
import tShower from "./timing/shower_argument_3d.json";
import tMeeting from "./timing/worry_meeting.json";
import tDrafts from "./timing/drafts.json";
import { WorryVideo } from "./WorryVideo";
import { ShowerArgumentVideo } from "./ShowerArgumentVideo";
import { WorryMeetingVideo } from "./WorryMeetingVideo";
import { DraftsVideo } from "./DraftsVideo";
import { NoContactVideo } from "./NoContactVideo";
import { WorseAtNightVideo } from "./WorseAtNightVideo";
import { AudienceOfOneVideo } from "./AudienceOfOneVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Worry3am" component={WorryVideo} durationInFrames={timing.total} fps={timing.fps} width={1080} height={1920} />
      <Composition id="NoContact" component={NoContactVideo} durationInFrames={tNoContact.total} fps={30} width={1080} height={1920} />
      <Composition id="WorseAtNight" component={WorseAtNightVideo} durationInFrames={tWorse.total} fps={30} width={1080} height={1920} />
      <Composition id="AudienceOfOne" component={AudienceOfOneVideo} durationInFrames={tAudience.total} fps={30} width={1080} height={1920} />
      <Composition id="ShowerArgument" component={ShowerArgumentVideo} durationInFrames={tShower.total} fps={30} width={1080} height={1920} />
      <Composition id="WorryMeeting" component={WorryMeetingVideo} durationInFrames={tMeeting.total} fps={30} width={1080} height={1920} />
      <Composition id="Drafts" component={DraftsVideo} durationInFrames={tDrafts.total} fps={30} width={1080} height={1920} />
    </>
  );
};
