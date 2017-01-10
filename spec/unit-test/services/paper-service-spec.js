import 'should';
import PaperService from '../../../services/paper-service';
import '../base';
import logicPuzzle from '../../../models/logic-puzzle';
import userHomeworkQuizzes from '../../../models/user-homework-quizzes';


describe('paperSrv', () => {

  let paperSrv;

  beforeEach(() => {
    paperSrv = new PaperService();
  });

  it('retrieve() should return one paper', function (done) {
    paperSrv.retrieve({userId: 1, programId: 1, paperId: 1}, (err, data) => {
      console.log(data)
      data.id.should.equal('586df703ad622812ec5e7bb3');
      done();
    })
  });

  it('getSection() should return sections status object', function (done) {
    paperSrv.getSection({userId: 1, programId: 1, paperId: 1}, (err, data) => {
      console.log(data)
      done();
    })
  });
});


