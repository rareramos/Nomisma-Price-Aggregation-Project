import * as React from 'react';
import { shallow } from 'enzyme';
import { LoadableTokenIcon } from 'components/common/loadable-token-icon';
import { ILoadableTokenIconProps } from 'types/components/common';

const LoadableTokenIconProps : ILoadableTokenIconProps = {
  symbol: 'Abx',
};

it('matches LoadableTokenIcon snapshot', () => {
  const wrapper = shallow(<LoadableTokenIcon {...LoadableTokenIconProps} />);
  expect(wrapper).toMatchSnapshot();
});
