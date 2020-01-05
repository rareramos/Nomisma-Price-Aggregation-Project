import {
  CompoundDataCurrentTimestamp,
  CompoundTableData,
  DharmaDataCurrentTimestamp,
  DharmaTableData,
  LoansTable,
  LoansTableTimestamp,
  MakerDataCurrentTimestamp,
  MakerTableData,
} from 'price-aggregation-db';
import { getToBlock } from '../timestamp/common';
import { log } from '../../utils/logger';
import { chunkedEventsReducerFactory } from '../timestamp';

const lastBlockRecordName = 'loans-table-last-block';

const mergeConfig = [
  {
    adapterName: 'Dharma',
    tableModel: DharmaTableData,
    timestampSingletonModel: DharmaDataCurrentTimestamp,
  },
  {
    adapterName: 'Compound',
    tableModel: CompoundTableData,
    timestampSingletonModel: CompoundDataCurrentTimestamp,
  },
  {
    adapterName: 'Maker',
    tableModel: MakerTableData,
    timestampSingletonModel: MakerDataCurrentTimestamp,
  },
];

const parseFields = [
  'repaidPercentage',
  'loanTimestamp',
  'loanSymbol',
  'collateralSymbol',
  'ccr',
  'principal',
  'loanTermSeconds',
  'apr',
  'principalTokenName',
  'platform',
  'principalUsd',
  'transactionHash',
];

const getParsedTableData = items => items
  .map(item => parseFields
    .reduce(
      (
        acc,
        field,
      ) => ({
        ...acc,
        [field]: item[field],
      }),
      {}
    )
  );

const mergeDatabases = async () => {
  const lastBlock = await getToBlock();
  await mergeConfig.reduce(
    async (
      acc,
      configItem,
    ) => {
      await acc;
      log.info(`Preparing to write data for ${configItem.adapterName} to merged table with updateBlock ${lastBlock}`);
      const lastTimestampObjArr = await configItem.timestampSingletonModel.find();
      if (!lastTimestampObjArr || !lastTimestampObjArr.length) {
        throw new Error(`can not find proper timestamp object for adapter: ${configItem.adapterName}`);
      }
      const fullTable = await configItem.tableModel.find({
        updateBlock: lastTimestampObjArr[0].currentBlock,
      });
      const parsedTableData = getParsedTableData(fullTable);
      const tableDataWithUpdateBlock = parsedTableData.map(
        item => ({
          ...item,
          updateBlock: lastBlock,
        })
      );
      log.info(`Saving ${tableDataWithUpdateBlock.length} records from ${configItem.adapterName} adapter to db`);
      return LoansTable.insertMany(tableDataWithUpdateBlock);
    },
    Promise.resolve(),
  );

  // Make sure that timestamp for last block exists
  // As chart endpoint relies on it to determine bins.
  await chunkedEventsReducerFactory(
    Promise.resolve(),
    [
      {
        blockNumber: lastBlock,
      },
    ]
  );

  const timestampObjArr = await LoansTableTimestamp.find();

  if (!timestampObjArr.length) {
    const newTimestampObj = {
      currentBlock: lastBlock,
      name: lastBlockRecordName,
    };
    await LoansTableTimestamp.insertOne(newTimestampObj);
  } else {
    await LoansTableTimestamp.updateOne({
      name: lastBlockRecordName,
    }, {
      $set: { currentBlock: lastBlock },
    });
  }
};

export default mergeDatabases;
