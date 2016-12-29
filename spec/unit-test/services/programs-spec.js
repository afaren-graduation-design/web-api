import 'should';
import SectionService from '../../../services/section-service';
import '../base';
import logicPuzzle from '../../../models/logic-puzzle';
import userHomeworkQuizzes from '../../../models/user-homework-quizzes';


describe('SectionService', () => {

  let sectionSrv;

  beforeEach(() => {
    sectionSrv = new SectionService();
  });

  it('getList() should return section list', function (done) {
    sectionSrv.getList({userId: 1, programId: 1, paperId: 1}, (err, data) => {
      done();
    })
  });
});

