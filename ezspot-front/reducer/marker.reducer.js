export default function (spot = {}, action) {
  if (action.type === 'addspot') {
    console.log('1er passage dans le reducer',action)
    var spotCopy = {...spot};
    spotCopy.latitude = action.spotLat;
    spotCopy.longitude = action.spotLong;
    return spotCopy;
  } else {
    return spot;
  };
}
