import React from 'react';
import { func,  bool } from 'prop-types';
import { SwitchBeta } from '@nomisma/nomisma-ui/beta/switch';

export const ComapreComp = ({ isInComapreMode, onClick }) => (
  <SwitchBeta
    checked={ isInComapreMode }
    onChange={ () => onClick(!isInComapreMode) }
  />
);

ComapreComp.propTypes = {
  isInComapreMode: bool.isRequired,
  onClick: func.isRequired,
};
