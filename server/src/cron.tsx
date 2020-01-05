/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { CfdQuasiLiveData, CfdScrapingData, CfdUnmatchedSymbolsData } from 'price-aggregation-db';
import { renderToStream } from '@react-pdf/renderer';

import { Cron } from './lib/cron/index';
import { Mailer } from './lib/mailer/index';
import { log as logger } from './utils/logger';
import { Template as DailyCheckNotifications } from './templates/emails/daily-check-notifications';
import { Report } from './templates/components/DailyCheckInstrumentsReport';
import { app } from '../environment';
import { Task } from './lib/cron/task';
import { ISendMessage, ISummary, IReportParams } from './types';

const { cron: cronConfig } = app;
const mailer = new Mailer();
const cron = new Cron();

// at 8:05am UTC
cron.add('Daily match instruments report', cronConfig.CRON_DAILY_REPORT_INSTRUMENTS,
  async (task : Task) : Promise<void> => {
    const services = ['Deribit', 'Bitmex', 'IG', 'Kraken'];
    const summary : Array<ISummary> = [];
    const message : ISendMessage = {
      to: 'maksym.plaksia@nomisma.one',
      subject: 'Daily Check Notification',
      template: DailyCheckNotifications,
    };
    services.forEach(async (serviceName : string) : Promise<void> => {
      /* eslint-enable no-await-in-loop */
      const combinedData = await CfdQuasiLiveData.find({ serviceName, matched: true });
      const unmatchedApiData = await CfdUnmatchedSymbolsData.find({ serviceName, from: 'api' });
      const unmatchedScrapingData = await CfdUnmatchedSymbolsData.find({
        serviceName,
        from: 'scraping',
      });
      const matched = await CfdQuasiLiveData.countDocuments({ serviceName, matched: true });
      const unmatched = await CfdUnmatchedSymbolsData.countDocuments({ serviceName });
      const countApiInstruments = await CfdQuasiLiveData.countDocuments({ serviceName });
      const countScrapingInstuments = await CfdScrapingData.countDocuments({ serviceName });
      const status = unmatched === 0
      && matched > 0
      && countApiInstruments === countScrapingInstuments
      && matched === countApiInstruments;
      summary.push({
        status,
        serviceName,
        countApiInstruments,
        countScrapingInstuments,
        matched,
        unmatched,
        combinedData,
        unmatchedApiData,
        unmatchedScrapingData,
      });
    });
    const props : IReportParams = {
      timestamp: new Date().toUTCString(),
      summary,
    };
    const content = await renderToStream(<Report {...props} />);
    message.attachments = [
      {
        filename: 'report.pdf',
        content,
      },
    ];
    await mailer.send(message, props);
    logger.info({ message: `Task ${task.name} finished` });
  });

cron.start();
