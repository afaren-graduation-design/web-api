const ProgramService = require('../services/program-service/index');

class ProgramController {
  create(req, res, next) {
    ProgramService.create(req.body, (err, data)=> {
      res.sendStatus(200)
    })
  }

  update(req, res, next) {
    const data = {
      programId: req.params.programId,
      programInfo: req.body
    }
    ProgramService.update(data, (err, doc) => {
      if (err && err.status) {
        res.sendStatus(404);
      }
      res.sendStatus(204)
    })
  }
}

module.exports = ProgramController;