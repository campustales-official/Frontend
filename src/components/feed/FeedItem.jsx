import PostItem from "./PostItem";
import EventItem from "./EventItem";
import AnnouncementItem from "./AnnouncementItem";

export default function FeedItem({ item }) {
  switch (item.type) {
    case "post":
      return <PostItem item={item} />;
    case "event":
      return <EventItem item={item} />;
    case "announcement":
      return <AnnouncementItem item={item} />;
    default:
      return null;
  }
}
