import styled from 'styled-components';
import { Grid } from '@nomisma/nomisma-ui/grid';
import { SimpleTable } from '@nomisma/nomisma-ui/table/simple-table';
import { ccpTableStyle } from '@nomisma/nomisma-ui/table/simple-table/styles';

export const Styled = styled.div`
  text-align: center;

  table {
    text-align: left;
  }

  label {
    text-align: left;
  }
`;

export const Title = styled.h5`
  margin: 2rem 0 0;
  text-align: left;
`;

export const GridContainer = styled(Grid)`
  margin: 1rem 0 2rem;
`;

export const Link = styled.a.attrs({
  href: props => props.href,
  target: props => props.target,
})`
  cursor: pointer;
  justify-self: end;
`;

export const StyledTable = styled(SimpleTable)(ccpTableStyle, {
  '.thead': {
    backgroundColor: 'inherit',
    marginTop: '3em',
  },
  '.th': {
    textAlign: 'center',
  },
  '.tbody': {
    backgroundColor: 'white',
    '.tr': {
      borderBottom: '1px solid var(--bgLight)',
    },
    '.tr:nth-of-type(2n)': {
      backgroundColor: 'inherit',
    },
    '.tr:hover': {
      backgroundColor: 'var(--bgLight)',
    },
  },
});

export const ProviderWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
`;

export const StyledText = styled.p`
  margin: 0;
  padding: 0;
`;
