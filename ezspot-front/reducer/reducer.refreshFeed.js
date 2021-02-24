export default function (refreshFeed = false, action) {
  if (action.type === 'refreshFeed') {
    console.log('passage dans le reducer refreshed',action)
    var refreshFeedCopy = !refreshFeed
    console.log("reducer refresh",refreshFeedCopy);
    return refreshFeedCopy;
  } else {
    return refreshFeed;
  };
}
