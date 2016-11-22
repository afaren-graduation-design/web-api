function addMakerName(resp, data) {
  let homeworks;
  if (resp.length) {
    homeworks = resp.body.map((response) => {
      let homeworkItem = data.filter((dataItem) => {
        return dataItem.makerId === response.userId;
      }).map((items) => {
        let item = items.toJSON();
        item.makerName = response.name;
        return item;
      });
      return homeworkItem;
    });
  } else {
    homeworks = data.map((dataItem) => {
      let item = dataItem.toJSON();
      item.makerName = resp.body.name;
      return item;
    });
  }
  return homeworks;
}

module.exports = addMakerName;