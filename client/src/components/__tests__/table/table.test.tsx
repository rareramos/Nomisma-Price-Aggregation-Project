import * as React from 'react';
import { shallow } from 'enzyme';

import { ViewCell } from 'components/table/view-cell';
import { IViewCellProps } from 'types/components/table';

const ViewCellProps : IViewCellProps = {
  transactionHash: 'usd',
};

describe('Table components tests', () => {
  it('matches Viewcell snapshot', () => {
    const wrapper = shallow(<ViewCell {...ViewCellProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
