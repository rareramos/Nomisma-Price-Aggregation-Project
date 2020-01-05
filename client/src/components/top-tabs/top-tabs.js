import React from 'react';
import {
  func, arrayOf, object, number,
} from 'prop-types';
import { Nav, NavItem } from '@nomisma/nomisma-ui/tabs/styles';
import { Lending } from '../lending';
import { Cfd } from '../cfd';
import { Dashboard } from '../dashboard';

export const TopTabs = ({ tabs, selectedSource, onClick }) => (
  <Nav
    selected={selectedSource}
    setActiveTab={index => onClick(tabs[index].value)}
  >
    <NavItem
      key={tabs[0].value}
      title={tabs[0].title}
    >
      <Lending />
    </NavItem>
    <NavItem
      key={tabs[1].value}
      title={tabs[1].title}
    >
      <Cfd />
    </NavItem>
    <NavItem
      key="dashboard"
      title="Dashboard"
    >
      <Dashboard />
    </NavItem>
  </Nav>
);

TopTabs.propTypes = {
  selectedSource: number.isRequired,
  tabs: arrayOf(object).isRequired,
  onClick: func.isRequired,
};
