import PostItem from "./PostItem";
import EventItem from "./EventItem";
import AnnouncementItem from "./AnnouncementItem";

export default function FeedItem({ item }) {
  // item can optionally carry 'actions' and 'showManageButton' from parent (ClubDetailsPage)
  const { actions, showManageButton } = item;

  switch (item.type) {
    case "post":
      return <PostItem item={item} actions={actions} />;
    case "event":
      return <EventItem item={item} actions={actions} showManageButton={showManageButton} />;
    case "announcement":
      return <AnnouncementItem item={item} actions={actions} />;
    default:
      return null;
  }
}
