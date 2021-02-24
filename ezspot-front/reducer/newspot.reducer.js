export default function (newSpot = {}, action) {
  if (action.type === 'newspot') {
    console.log('2ème passage dans le reducer',action)
    return action.newSpot;
  } else {
    return newSpot;
  };
}
