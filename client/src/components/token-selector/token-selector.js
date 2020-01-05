import React from 'react';
import { array, func, string } from 'prop-types';

import { BetaButton, BTN_SIZE } from '@nomisma/nomisma-ui/beta/button';
import { CurrencyDropDown } from '@nomisma/nomisma-ui/beta/dropdown/currency-drop-down';

export const TokenSelector = ({
  tokens,
  selectedToken,
  onSelectToken,
}) => {
  const items = tokens.map(token => ({
    item: { abbrKey: token, name: token },
    key: token,
    onSelectChange: (item) => onSelectToken(item.key),
  }));
  const toggleButton = (
    <div style={{ padding: '0 1rem' }}>
      { selectedToken ? selectedToken : 'Select token' }
    </div>
  );
  const footer = (
    <div>
      <BetaButton
        size={ BTN_SIZE.SMALL }
        onClick={ onSelectToken.bind(null, null) }
      >clear</BetaButton>
    </div>
  );

  return (
    <div style={{ background: 'white' }}>
      <CurrencyDropDown
        items={ items }
        closeOnSelect
        toggleMenuAreaContent={ toggleButton }
        Footer={ () => footer }
      />
    </div>
  );
};

TokenSelector.propTypes = {
  tokens: array,
  selectedToken: string,
  onSelectToken: func.isRequired,
};
