export default class OperateHandle {
  handle(msgObj, callback) {
    if (!this.check(msgObj)) {
      return callback();
    }
    this.subHandle(msgObj, callback);
  }
}
