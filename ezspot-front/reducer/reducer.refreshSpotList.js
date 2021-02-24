export default function (refreshSpotList = false, action) {
  if (action.type === 'refreshSpotList') {
    console.log('passage dans le reducer refreshed',action)
    var refreshSpotListCopy = !refreshSpotList
    console.log("reducer refresh",refreshSpotListCopy);
    return refreshSpotListCopy;
  } else {
    return refreshSpotList;
  };
}
