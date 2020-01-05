import React, { ReactElement } from 'react';
import { IconQtum } from '@nomisma/nomisma-ui/token-icons';
import { ICfdTableProps } from 'types/components/cfd';
import {
  Styled,
  StyledTable,
  ProviderWrapper,
  StyledText,
} from './styled';

export const CfdTable = ({
  cfdHeader,
  cfdKey,
  cfdBody,
  uniqueProviderNames,
} : ICfdTableProps) : ReactElement => {
  function resolveBodyData() : Array<Array<ReactElement>> {
    return cfdBody.length > 0 && cfdBody.map((provider : Array<string>) => provider.map((item : string) => {
      if (uniqueProviderNames.filter((providerName : string) => providerName === item).length > 0) {
        return (
          <ProviderWrapper>
            <IconQtum
              fontSize="16px"
            />
            <StyledText>
              { item }
            </StyledText>
          </ProviderWrapper>
        );
      }
      return (
        <StyledText>
          { item }
        </StyledText>
      );
    }));
  }

  return (
    <Styled>
      { cfdBody.length > 0 && (
        <StyledTable
          header={cfdHeader}
          body={resolveBodyData()}
          keys={cfdKey}
        />
      ) }
    </Styled>
  );
};
