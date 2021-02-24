export default function (actualisationProfile = false, action) {
  if (action.type === 'actualisationProfile') {
    console.log("photo save");
    var actualisationCopy = !actualisationProfile
    console.log("reducer data",actualisationCopy);
    return actualisationCopy;
  } else {
    return actualisationProfile;
  }
}
