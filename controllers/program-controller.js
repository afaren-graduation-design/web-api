const ProgramService = require('../services/program-service/index');

const programService = new ProgramService();

class ProgramController {
  create(req, res, next) {
    programService.create(req, (err, result)=> {
      if (err) {
        return next(err);
      }
      return res.status(201).send(result);
    })
  }

  update(req, res, next) {
    const data = {
      _id: req.params.programId,
      programInfo: req.body
    };
    programService.update(data, (err, doc) => {
      if (err && err.status) {
        res.sendStatus(404);
      }
      res.sendStatus(204)
    })
  }

  getList(req, res, next) {
    programService.getList(req.session.user.id, (err, data)=> {
      if (err) {
        return next(err);
      }
      return res.status(200).send(data);
    });
  }
}

module.exports = ProgramController;