import React from 'react';
import { func, bool } from 'prop-types';
import { Switch } from '@nomisma/nomisma-ui/charts/switch';

export const ComapreComp = ({ isInComapreMode, onClick }) => (
  <Switch
    checked={isInComapreMode}
    onChange={() => onClick(!isInComapreMode)}
  />
);

ComapreComp.propTypes = {
  isInComapreMode: bool.isRequired,
  onClick: func.isRequired,
};
