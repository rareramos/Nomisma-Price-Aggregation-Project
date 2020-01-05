import React from 'react';
import { func, arrayOf, object, number } from 'prop-types';
import {
  Tabs,
  TabPanel,
} from '@nomisma/nomisma-ui/beta/tabs';
import { Styled } from './styled';

export const Switcher = ({ tabs, selectedSource, onClick }) => (
  <Styled>
    <Tabs
      selected={ selectedSource }
      setActiveTab={ (index) => onClick(tabs[index].value) }
    >
      {
        tabs.map((tab) => (
          <TabPanel
            key={ tab.value }
            title={ tab.name }
          />
        ))
      }
    </Tabs>
  </Styled>
);

Switcher.propTypes = {
  selectedSource: number.isRequired,
  tabs: arrayOf(object).isRequired,
  onClick: func.isRequired,
};
