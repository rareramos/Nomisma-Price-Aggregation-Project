import React from 'react';
import {
  func, arrayOf, object, number,
} from 'prop-types';
import { SecondaryNav, TabsSecondaryItem } from '@nomisma/nomisma-ui/tabs/styles';
import { useTabs } from '@nomisma/nomisma-ui/tabs';
import { Styled } from './styled';

export const Switcher = ({ tabs, selectedSource, onClick }) => {
  const { getTabProps } = useTabs();
  return (
    <Styled>
      <SecondaryNav
        selected={selectedSource}
        setActiveTab={index => onClick(tabs[index].value)}
      >
        {
          tabs.map((tab, index) => (
            <TabsSecondaryItem
              {...getTabProps(index)}
            />
          ))
        }
      </SecondaryNav>
    </Styled>
  );
};

Switcher.propTypes = {
  selectedSource: number.isRequired,
  tabs: arrayOf(object).isRequired,
  onClick: func.isRequired,
};
