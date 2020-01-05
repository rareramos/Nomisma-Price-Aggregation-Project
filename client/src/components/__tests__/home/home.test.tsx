import * as React from 'react';
import { shallow } from 'enzyme';

import { IHomeProps } from 'types/components/home';
import { Home } from 'components/home/home';

const HomeProps : IHomeProps = {
  navigateToCFD: jest.fn,
};

describe('Home test', () => {
  it('matches home snapshot', () => {
    const wrapper = shallow(<Home {...HomeProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
