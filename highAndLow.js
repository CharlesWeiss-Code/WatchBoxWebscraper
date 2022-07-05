highAndLow = { "116500LN-0001": [1000, 2000], "116500LN-0002": [5000, 10000] };

pushToHighAndLow = (refNum, low, high) => {
  highAndLow[refNum] = [low, high];
};
getHighAndLow = (i) => highAndLow[i];

getDict = () => highAndLow;

module.exports = { getHighAndLow, pushToHighAndLow, getDict };
