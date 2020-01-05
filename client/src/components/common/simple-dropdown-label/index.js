import React from 'react';
import { string, arrayOf, object } from 'prop-types';
import { Grid } from '@nomisma/nomisma-ui/grid';
import { SimpleDropDown } from '@nomisma/nomisma-ui/form/dropdown/simple-drop-down';
import { Label, MenuArea } from './styled';

export const SimpleDropDownWithLabel = ({
  label,
  selectedItem,
  dropdownItems,
}) => (
  <Grid
    column="1fr 1fr"
  >
    <Label>{ label }</Label>
    <SimpleDropDown
      toggleMenuAreaContent={(
        <MenuArea>
          { selectedItem }
        </MenuArea>
      )}
      items={dropdownItems}
      renderItem={({ key, item: { value } }) => (
        <div
          id={String(key)}
        >
          { value }
        </div>
      )}
    />
  </Grid>
);

SimpleDropDownWithLabel.propTypes = {
  label: string.isRequired,
  selectedItem: string.isRequired,
  dropdownItems: arrayOf(object).isRequired,
};
