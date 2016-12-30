import Message from '../../models/messages';
export default class OperateHandle {
  handle(msgObj, callback) {
    if (!this.check(msgObj)) {
      Message.findById(msgObj._id, (err, doc, next) => {
        if (err) {
          return next(err);
        }
        return doc;
      });
    }
    this.subHandle(msgObj, callback);
  }
}
