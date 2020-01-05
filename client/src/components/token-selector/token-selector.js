import React from 'react';
import { array, func, string } from 'prop-types';

import { Button } from '@nomisma/nomisma-ui/button';
import { CurrencyDropDownInput } from '@nomisma/nomisma-ui/form/currency-drop-down-input';

export const TokenSelector = ({
  tokens,
  selectedToken,
  onSelectToken,
}) => {
  const items = tokens.map(token => ({
    item: { abbrKey: token, name: token },
    key: token,
    onSelectChange: item => onSelectToken(item.key),
  }));
  const toggleButton = (
    <div style={{ padding: '0 1rem' }}>
      { selectedToken || 'Select token' }
    </div>
  );
  const footer = (
    <div>
      <Button
        size="SMALL"
        onClick={() => onSelectToken(null)}
      >
        clear
      </Button>
    </div>
  );

  return (
    <div style={{ background: 'white' }}>
      <CurrencyDropDownInput
        items={items}
        closeOnSelect
        toggleMenuAreaContent={toggleButton}
        Footer={() => footer}
      />
    </div>
  );
};
TokenSelector.defaultProps = {
  tokens: [],
};
TokenSelector.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  tokens: array,
  // eslint-disable-next-line react/require-default-props
  selectedToken: string,
  onSelectToken: func.isRequired,
};
