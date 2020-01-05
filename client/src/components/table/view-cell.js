import React from 'react';
import { string } from 'prop-types';

export const ViewCell = ({
  transactionHash,
}) => (
  <a
    href={`https://etherscan.io/tx/${transactionHash}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    View
  </a>
);

ViewCell.propTypes = {
  transactionHash: string.isRequired,
};
