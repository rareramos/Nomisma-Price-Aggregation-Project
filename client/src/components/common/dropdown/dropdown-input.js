import React, { Component } from 'react';
import {
  Button,
} from '@nomisma/nomisma-ui/button';
import {
  CurrencyDropDownInput,
} from '@nomisma/nomisma-ui/form/currency-drop-down-input';
import {
  string, func, bool, array,
  arrayOf, shape,
} from 'prop-types';
import { deriveItemDetails } from './derive-item-details';
import {
  WithFilter,
} from './with-filter';
import { ButtonLeft } from './styled';
import { cvaSettingItems } from '../../../utils/cfd';

export class DropDownInput extends Component {
  getFinalItems() {
    const {
      onSelectChange,
      selectedItems,
      excludedItems = [],
      disabledItems = [],
      details,
    } = this.props;

    const listedCurrencies = Object.values(
      excludedItems.reduce((
        currentItems,
        nextExcluded,
      ) => {
        // eslint-disable-next-line no-param-reassign
        delete currentItems[nextExcluded];
        return currentItems;
      }, { ...details }),
    );
    return deriveItemDetails({
      items: listedCurrencies,
      selected: selectedItems,
      disabled: disabledItems,
      itemKey: item => item.abbrKey,
      onSelectChange,
    });
  }

  render() {
    const items = this.getFinalItems();
    const {
      hideFooter,
      closeDropdown,
      hideFilter,
      ...rest
    } = this.props;
    return (
      <WithFilter items={items}>
        { ({ filteredItems, setFilterFromEvent, setFilterByValue }) => (
          <CurrencyDropDownInput
            {...rest}
            items={filteredItems}
            onSearchInputChange={!hideFilter && setFilterFromEvent}
            Footer={!hideFooter ? ({ closeMenu }) => (
              <div>
                <ButtonLeft
                  btnType="PRIMARY"
                  size="SMALL"
                  onClick={() => {
                    setFilterByValue('');
                    (closeDropdown || closeMenu)();
                  }}
                >
              Confirm
                </ButtonLeft>
                <Button
                  btnType="WARNING"
                  size="SMALL"
                  onClick={() => {
                    setFilterByValue('');
                    (closeDropdown || closeMenu)();
                  }}
                >
              Cancel
                </Button>
              </div>
            ) : undefined}
          />
        ) }
      </WithFilter>
    );
  }
}

DropDownInput.defaultProps = {
  closeDropdown: undefined,
  hideFooter: undefined,
  hideSelectionInfo: undefined,
  details: cvaSettingItems,
  selectedItems: ['BTC/USD'],
  excludedItems: [],
  disabledItems: [],
  onSelectChange: func,
  onClear: func,
  hasNoBorder: undefined,
  hideFilter: undefined,
};

DropDownInput.propTypes = {
  closeDropdown: func,
  hideFooter: bool,
  hideSelectionInfo: bool,
  details: arrayOf(shape({ abbrKey: string, value: string })),
  selectedItems: arrayOf(shape(string)),
  // eslint-disable-next-line react/forbid-prop-types
  excludedItems: array,
  // eslint-disable-next-line react/forbid-prop-types
  disabledItems: array,
  onSelectChange: func,
  onClear: func,
  hasNoBorder: bool,
  hideFilter: bool,
};
