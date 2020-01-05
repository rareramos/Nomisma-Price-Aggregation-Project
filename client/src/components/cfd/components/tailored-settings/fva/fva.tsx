import React, { ReactElement, ReactNode } from 'react';
import {
  bool,
  arrayOf,
  array,
  object,
  func,
  string,
  number,
} from 'prop-types';
import { Modal } from '@nomisma/nomisma-ui/overlays/modal';
import { IFVAProps, TFVAInitialMarginTableBody, ICFDModalData } from 'types/components/cfd';

import {
  SubHeading,
  SubWrapper,
  GridWrapper,
  Label,
  StyledButton,
  ButtonWrapper,
  InfoIcon,
  ModalTab,
  StyledInputBox,
} from '../styled';

import { MarginOption } from './margin-option';
import { PricingOption } from './pricing-option';
import { CorrelationsOption } from './correlations-option';
import { VolatilityOption } from './volatility-option';
import { InputTable } from '../../../../common/input-table';

export const Fva = ({
  showCFDModal,
  cfdModalsData,
  toggleCFDModal,
  initialMarginTableHeader,
  initialMarginTableKey,
  initialMarginTableBody,
  selectedTabCFDModal,
  onCFDModalTabChange,
  onCFDModalClose,
} : IFVAProps) : ReactElement => {
  function resolveInputFields() : Array<Array<TFVAInitialMarginTableBody>> {
    return initialMarginTableBody.map(
      (arr : Array<TFVAInitialMarginTableBody>) : Array<TFVAInitialMarginTableBody> => arr.map(
        (item : TFVAInitialMarginTableBody) : TFVAInitialMarginTableBody => {
          if (typeof item === 'number') {
            return <StyledInputBox type="number" defaultValue={item.toString()} unit="%" />;
          }
          return item;
        },
      ),
    );
  }

  function resolveCfdModalsData() : Array<ICFDModalData> {
    cfdModalsData.forEach((modal : ICFDModalData) => {
      if (modal.title === 'Request Initial Margin') {
        modal.render = () : ReactNode => (
          <ModalTab>
            <InputTable
              header={initialMarginTableHeader}
              keys={initialMarginTableKey}
              body={resolveInputFields()}
            />
          </ModalTab>
        );
      } else if (modal.title === 'Initial on Margin') {
        modal.render = () : ReactNode => <ModalTab>Initial on Margin</ModalTab>;
      } else if (modal.title === 'You own Funding Offer') {
        modal.render = () : ReactNode => <ModalTab>You own Funding Offer</ModalTab>;
      }
    });
    return cfdModalsData;
  }

  return (
    <SubWrapper>
      <SubHeading>FVA</SubHeading>
      <GridWrapper>
        <Label>Request Initial Margin</Label>
        <ButtonWrapper>
          <StyledButton
            btnType="SECONDARY"
            onClick={toggleCFDModal}
          >
            View
          </StyledButton>
          <InfoIcon />
        </ButtonWrapper>
        <Label>Interest on Margin</Label>
        <ButtonWrapper>
          <StyledButton
            btnType="SECONDARY"
          >
            View
          </StyledButton>
          <InfoIcon />
        </ButtonWrapper>
        <Label>Your Own Funding Offer</Label>
        <ButtonWrapper>
          <StyledButton
            btnType="SECONDARY"
          >
            View
          </StyledButton>
          <InfoIcon />
        </ButtonWrapper>
        <MarginOption />
        <PricingOption />
        <CorrelationsOption />
        <VolatilityOption />
      </GridWrapper>
      {showCFDModal && (
        <Modal
          modals={resolveCfdModalsData()}
          selectedTab={selectedTabCFDModal}
          onSelectTab={() => onCFDModalTabChange()}
          onClose={onCFDModalClose}
        />
      )}
    </SubWrapper>
  );
};

Fva.propTypes = {
  showCFDModal: bool.isRequired,
  toggleCFDModal: func.isRequired,
  onCFDModalTabChange: func.isRequired,
  onCFDModalClose: func.isRequired,
  selectedTabCFDModal: number.isRequired,
  cfdModalsData: arrayOf(object).isRequired,
  initialMarginTableHeader: arrayOf(string).isRequired,
  initialMarginTableKey: arrayOf(string).isRequired,
  initialMarginTableBody: arrayOf(array).isRequired,
};
