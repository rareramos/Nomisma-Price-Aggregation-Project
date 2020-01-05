/* eslint-disable no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

import { ISummary, IMailSender } from '../../types';

export const Template = ({ summary, timestamp } : IMailSender) : JSX.Element => (
  <div>
    <p>Daily Checking Notification.</p>
    <div>Timestamp: {timestamp}</div>
    <div>
      Summary:
      {Array.from(summary || []).map((result : ISummary) : JSX.Element => (
        <p key={result.serviceName}>
          {result.serviceName}:{' '}
          {result.status ? (
            <b style={{ color: 'green' }}>Successful</b>
          ) : (
            <b style={{ color: 'red' }}>Unsuccessful</b>
          )}
          ;
          <i>
            {result.matched} instruments matched; {result.unmatched} instrument unmatched;
          </i>
        </p>
      ))}
    </div>
  </div>
);
