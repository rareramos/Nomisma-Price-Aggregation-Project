import styled from 'styled-components';
import { SimpleTable } from '@nomisma/nomisma-ui/table/simple-table';
import { ccpTableStyle } from '@nomisma/nomisma-ui/table/simple-table/styles';
import { theme } from '@nomisma/nomisma-ui/themes';

export const StyledTable = styled(SimpleTable)(ccpTableStyle, {
  '.thead': {
    background: theme.bgDark,
    padding: '15px',
  },
  '.td': {
    display: 'flex',
    justifyContent: 'center',
  },
  '.th': {
    alignSelf: 'center',
    textAlign: 'center',
  },
  '.tbody': {
    backgroundColor: theme.white,
    '.tr': {
      borderBottom: `1px solid ${theme.bgLight}`,
      height: '45px',

      '&:nth-of-type(2n)': {
        backgroundColor: 'inherit',
      },
      '&:hover': {
        backgroundColor: theme.bgLight,
      },
      '.td': {
        alignItems: 'center',
      },
    },
  },
});
