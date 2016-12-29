export default class OperateHandle {
  handle(msgObj, callback) {
    if (!this.check(msgObj)) {
      return callback();
    }
    this.realHandle(msgObj, callback);
  }
}
