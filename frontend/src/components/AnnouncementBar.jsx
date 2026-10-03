import { useStudioSettings } from "../lib/studio";

export default function AnnouncementBar() {
  const { announcement } = useStudioSettings();
  return <p className="announce">{announcement}</p>;
}
