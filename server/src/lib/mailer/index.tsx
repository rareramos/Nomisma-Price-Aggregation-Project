/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import nodemailer from 'nodemailer';
import { htmlToText } from 'nodemailer-html-to-text';

import { Layout as DefaultLayout } from '../../templates/emails/layouts/default';
import { ISendMessage, IReportParams, IMailSender } from '../../types';

export class Mailer {
  transporter : nodemailer.Transporter;
  constructor() {
    // Init transporter
    this.transporter = nodemailer.createTransport(
      'smtp://AKIAS7ZS6OAB3BWQV6H6:BCZ2MNf2ot7NBVZitwXWFPWe2r2esqVenKd2VwAFchW1@email-smtp.us-east-1.amazonaws.com',
      {
        from: 'donotreply@nomisma.one',
      }
    );
    this.transporter.use('compile', htmlToText());
    this.transporter.verify((error: Error | null) : void => {
      if (error) {
        throw new Error(error ? error.message : 'mailer transporter error');
      } else {
        // console.log('Mailer is ready to take our messages'); // eslint-disable-line
      }
    });
  }

  subject(str : string) : string {
    return str;
  }

  render(Template : React.FunctionComponent<IMailSender>, props : IMailSender ) {
    // Set sender if not exists
    if (!props.sender) {
      props.sender = {
        company: {
          name: 'Nomisma Team',
          email: 'support@nomisma.one',
          website: 'https://nomisma.one',
          logo: 'https://nomisma.one/wp-content/uploads/2019/04/nomisma_logo_dark.png',
          footerLinks: [
            { title: 'Privacy Policy', url: 'https://nomisma.one/privacy-policy' },
            { title: 'Terms Of Service', url: 'https://nomisma.one/terms-of-service' },
          ],
        },
      };
    }
    return ReactDOMServer.renderToStaticMarkup(
      <DefaultLayout {...props}>
        <Template {...props} />
      </DefaultLayout>
    );
  }

  // input { to, cc, bcc, subject, template, attachments }
  async send(input : ISendMessage, data : IReportParams) {
    const { template, subject, ...message } = input!;
    const html = this.render(template, data);
    return this.transporter.sendMail({
      ...message,
      subject: this.subject(subject),
      html: html,
    });
  }
}
