export default function (refreshed = false, action) {
  if (action.type === 'markerRefreshed') {
    console.log('passage dans le reducer refreshed',action)
    var refreshedCopy = !refreshed
    console.log("reducer refresh",refreshedCopy);
    return refreshedCopy;
  } else {
    return refreshed;
  };
}
