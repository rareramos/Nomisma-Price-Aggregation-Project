import React from 'react';
import { shallow } from 'enzyme';

import { Switcher as SwitcherComp } from 'components/switcher/switcher';
import { ISwitcherProps } from 'types/components/switcher';
import { getTabs } from 'utils';

const SwitcherProps : ISwitcherProps = {
  onClick: jest.fn,
  selectedSource: 1,
  tabs: getTabs(),
};

describe('Switcher test', () => {
  it('matches switcher component snapshot', () => {
    const wrapper = shallow(<SwitcherComp {...SwitcherProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
