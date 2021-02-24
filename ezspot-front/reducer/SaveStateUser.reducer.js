export default function (stateUser = {}, action) {
  console.log("reducer savedatauser");
  if (action.type === 'StateUser') {
    var stateUserCopy = action.userState
    return stateUserCopy;
  } else {
    return stateUser;
  };
}
