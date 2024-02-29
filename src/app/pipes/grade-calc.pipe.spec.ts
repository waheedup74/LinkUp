import { GradeCalcPipe } from './grade-calc.pipe';

describe('GradeCalcPipe', () => {
  it('create an instance', () => {
    const pipe = new GradeCalcPipe();
    expect(pipe).toBeTruthy();
  });

  it('should assign A when above 90', () => {
    const pipe = new GradeCalcPipe();
    let grade = pipe.transform(93);
    expect(grade).toBe('A')
  })
});
