export default class LogicPuzzleSectionService {
  getStatus(section, callback) {
    callback(null, {type: section.type, status: '==='});
  }
}