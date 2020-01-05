import React from 'react';
import {
  arrayOf,
  string,
  oneOfType,
  bool,
  array,
} from 'prop-types';
import { StyledTable } from './styled';

export const InputTable = ({
  header,
  body,
  keys,
}) => (
  <React.Fragment>
    { body.length > 0 && (
      <StyledTable
        header={header}
        body={body}
        keys={keys}
      />
    )}
  </React.Fragment>
);

InputTable.propTypes = {
  header: arrayOf(string).isRequired,
  body: oneOfType([
    arrayOf(array),
    bool,
  ]).isRequired,
  keys: arrayOf(string).isRequired,
};
