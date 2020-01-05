import assert from 'assert';
import tInYears from '../../src/utils/t-in-years';

describe('t-in-years', () => {
  it('(0) = 0', () => {
    assert.equal(tInYears(0), 0);
  });
  it('(undefined) = 0', () => {
    assert.equal(tInYears(undefined), 0);
  });
  it('(null) = 0', () => {
    assert.equal(tInYears(null), 0);
  });
  it('(false) = 0', () => {
    assert.equal(tInYears(false), 0);
  });
  it('(0, 0) = 0', () => {
    assert.equal(tInYears(0, 0), 0);
  });
  it('(2019-07-26, 0) = 0', () => {
    assert.equal(tInYears('2019-07-26', 0), 0);
  });
  it('(2019-07-26, 2019-07-15) = 0.03013699', () => {
    assert.equal(tInYears('2019-07-26', '2019-07-15'), 0.03013699);
  });
  it('(new Date(2019-07-26), new Date(2019-07-15)) = 0.03013699', () => {
    assert.equal(tInYears(new Date('2019-07-26'), new Date('2019-07-15')), 0.03013699);
  });
});
