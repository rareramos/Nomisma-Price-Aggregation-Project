import React, { ReactElement, ReactNode } from 'react';
import { Grid } from '@nomisma/nomisma-ui/grid';
import { Collapse, ICollapseToggleProps } from '@nomisma/nomisma-ui/collapse';
import { Checkbox } from '@nomisma/nomisma-ui/form/checkbox';
import { ITailoredSettingsProps } from 'types/components/cfd';
import { Fva } from './fva';
import { Cva } from './cva';
import { TradingFees } from './trading-fees';

import {
  Wrapper,
  Heading,
  Body,
  CollapseToggle,
} from './styled';

export const TailoredSettings = ({
  showTailoredSettings,
  showCFDModal,
  cfdModalsData,
  toggleCFDModal,
  toggleTailoredView,
  initialMarginTableHeader,
  initialMarginTableKey,
  initialMarginTableBody,
  selectedTabCFDModal,
  onCFDModalTabChange,
  onCFDModalClose,
} : ITailoredSettingsProps) : ReactElement => (
  <Collapse
    open={showTailoredSettings}
    renderToggle={({
      isOpen, onToggle,
    } : ICollapseToggleProps) : ReactNode => (
      <CollapseToggle onClick={toggleTailoredView}>
        <Checkbox
          checked={isOpen}
          name="checkbox1"
          label="Show Tailored Settings"
          onChange={onToggle}
        />
      </CollapseToggle>
    )}
  >
    <Wrapper>
      <Heading>Tailored Settings</Heading>
      <Body>
        <Grid
          column="1fr 1fr 1fr"
          columnGap="5px"
          rowGap="5px"
        >
          <Fva
            showCFDModal={showCFDModal}
            cfdModalsData={cfdModalsData}
            toggleCFDModal={toggleCFDModal}
            initialMarginTableHeader={initialMarginTableHeader}
            initialMarginTableKey={initialMarginTableKey}
            initialMarginTableBody={initialMarginTableBody}
            selectedTabCFDModal={selectedTabCFDModal}
            onCFDModalTabChange={onCFDModalTabChange}
            onCFDModalClose={onCFDModalClose}
          />
          <Cva />
          <TradingFees />
        </Grid>
      </Body>
    </Wrapper>
  </Collapse>
);
