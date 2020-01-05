import React from 'react';
import {
  arrayOf, func, shape, string,
} from 'prop-types';
import { Nav } from './nav';
import { NavItem } from './nav-item';
import { TabContainer } from './container';

export function ChartTabs(props) {
  const { navItems, selected, setActiveNavItem } = props;
  return (
    <TabContainer>
      <Nav>
        {
          navItems.map((item) => {
            const { title, type } = item;
            return (
              <NavItem
                selected={type === selected}
                key={type}
                onClick={() => setActiveNavItem(type)}
              >
                {title}
              </NavItem>
            );
          })
        }
      </Nav>
    </TabContainer>
  );
}

ChartTabs.propTypes = {
  navItems: arrayOf(shape({ title: string, type: string })).isRequired,
  selected: string.isRequired,
  setActiveNavItem: func.isRequired,
};
