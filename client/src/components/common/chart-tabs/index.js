import React from 'react';
import { Nav } from './nav';
import { NavItem } from './nav-item';
import { TabContainer } from './container';
import { array, func, any } from 'prop-types';

export class ChartTabs extends React.Component {
  render() {
    const { navItems, selected, setActiveNavItem } = this.props;
    return (
      <TabContainer>
        <Nav>
          {
            navItems.map(item => {
              const { title, type } = item;
              return (
                <NavItem
                  selected={ type === selected }
                  key={ type }
                  onClick={ setActiveNavItem.bind(this, type) }
                >
                  { title }
                </NavItem>
              );
            })
          }
        </Nav>
      </TabContainer>
    );
  }
}

ChartTabs.propTypes = {
  navItems: array,
  selected: any,
  setActiveNavItem: func,
};
