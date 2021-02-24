export default function (DataSpotList = [], action) {
  console.log("reducer DataSpotList dfghjklfghjkhjchgkvjbcvb");
  if (action.type === 'spotListData') {

    var DataSpotListCopy = action.spotList
    console.log("Reducer DataSpotList",DataSpotListCopy);
    return DataSpotListCopy;
  } else {
    return DataSpotList;
  };
}
