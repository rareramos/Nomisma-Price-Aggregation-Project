import React from 'react';
import { shallow } from 'enzyme';

import { Lending as LendingComp } from 'components/lending/lending';
import { ILendingProps } from 'types/components/lending';


const LendingProps : ILendingProps = {
  columns: [],
  filter: {},
  handlePageChange: jest.fn,
  loading: true,
  pageCount: 25,
  sortByColumn: jest.fn,
  tableData: [{}],
};

describe('Lending test', () => {
  it('matches lending component snapshot', () => {
    const wrapper = shallow(<LendingComp {...LendingProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
