export default function (userData = {}, action) {
  console.log("reducer savedatauser");
  if (action.type === 'SaveDataUser') {
    var userDataCopy = action.userData
    return userDataCopy;
  } else {
    return userData;
  };
}
