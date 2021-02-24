export default function (refreshedMap = false, action) {
  if (action.type === 'refreshedMap') {
    console.log('passage dans le reducer refreshed',action)
    var refreshedMapCopy = !refreshedMap
    console.log("reducer refresh",refreshedMapCopy);
    return refreshedMapCopy;
  } else {
    return refreshedMap;
  };
}
