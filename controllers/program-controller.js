const ProgramService = require('../services/program-service/index');

class ProgramController {
  create(req, res, next) {
    ProgramService.create(req.body, (err, data)=> {
      res.sendStatus(200)
    })
  }
}

module.exports = ProgramController;