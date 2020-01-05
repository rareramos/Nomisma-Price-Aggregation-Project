import React from 'react';
import PropTypes from 'prop-types';

const ViewCell = ({
  transactionHash,
}) => (
  <a
    href={ `https://etherscan.io/tx/${transactionHash}` }
    target='_blank'
    rel='noopener noreferrer'
  >
    View
  </a>
);

ViewCell.propTypes = {
  transactionHash: PropTypes.string.isRequired,
};

export default ViewCell;
