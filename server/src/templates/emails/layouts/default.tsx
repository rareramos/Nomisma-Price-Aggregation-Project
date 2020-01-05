// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

import { IMailSender, IFooterlinks, ITableStyle } from '../../../types';

const tableStyles = (width : string, border : string, cellSpacing : string, cellPadding : string) : ITableStyle => ({
  width,
  border,
  'border-spacing': cellSpacing,
  'border-collapse': cellPadding,
});

const styles = {
  body1: {
    fontFamily: 'Helvetica,Arial,sans-serif',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#222222',
  },
  body1Secondary: {
    fontFamily: 'Helvetica,Arial,sans-serif',
    fontSize: '12px',
    lineHeight: '24px',
    color: '#656565',
  },
};
const defaultSenderObj = {
  company: {
    website: '',
    logo: '',
    email: '',
    name: '',
    footerLinks: [],
  },
};

const defaultRecipientObj = {
  _id: '',
  name: '',
};

export const Layout = ({ children, sender = defaultSenderObj, recipient = defaultRecipientObj } : IMailSender)
: JSX.Element => (
  <table style={{ ...tableStyles('100%', '0', '0', '0'), backgroundColor: '#f2f2f2' }}>
    <tbody>
      <tr>
        <td align="center">
          <table style={{ ...tableStyles('808', '0', '0', '0') }}>
            <tbody>
              <tr>
                <td style={{ margin: 'auto', paddingTop: 30, paddingBottom: 25 }}>
                  <a href={sender.company.website} target="_blank">
                    <img
                      src={sender.company.logo}
                      alt={sender.company.name}
                      style={{ width: '500', border: '0' }}
                    />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <table style={{ ...tableStyles('808', '0', '0', '0') }}>
            <tbody>
              <tr>
                <td>
                  <table style={{ ...tableStyles('100%', '0', '0', '0') }}>
                    <tbody>
                      <tr>
                        <td>
                          <table style={{ ...tableStyles('100%', '0', '0', '0') }}>
                            <tbody>
                              <tr>
                                <td style={{ backgroundColor: '#FFFFFF', width: 800, marginTop: '0px' }}>
                                  <table style={{ ...tableStyles('100%', '0', '0', '0') }}>
                                    <tbody>
                                      <tr>
                                        <td style={{ ...styles.body1, padding: 30, margin: '0px' }}>
                                          <p style={{ fontSize: 18 }}>Hello {recipient.name}</p>
                                          <div>{children}</div>
                                          <p>
                                            Regards,
                                            <br />
                                            {sender.company.name}
                                          </p>
                                          <p>
                                            <small>
                                              If you have any questions please connect with your
                                              {sender.company.name}.{' '}
                                            </small>
                                          </p>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <table style={{ ...tableStyles('100%', '0', '0', '0') }}>
            <tbody>
              <tr>
                <td style={{ margin: 'auto', height: '25' }}>
                  {Array.from(sender.company.footerLinks).map((link : IFooterlinks) : JSX.Element => (
                    <a key={link.title} href={link.url}>
                      {link.title}
                    </a>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>

          <table style={{ ...tableStyles('808', '0', '0', '0'), margin: 'auto' }}>
            <tbody>
              <tr>
                <td style={{ ...styles.body1Secondary, margin: 'auto' }}>
                  If you do not want to receive more emails from this site, you can
                  <a
                    href={`${sender.company.website}/unsubscribe/${recipient._id}`}
                    target="_blank"
                  >
                    unsubscribe
                  </a>
                </td>
              </tr>
              <tr>
                <td style={{ ...styles.body1Secondary, margin: 'auto' }}>
                  Powered by <a href={sender.company.website}>{sender.company.name}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
);
