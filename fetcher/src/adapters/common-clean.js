import {
  DharmaTableData,
  DharmaDataCurrentTimestamp,
  CompoundTableData,
  CompoundDataCurrentTimestamp,
} from 'price-aggregation-db';
import { log } from '../utils/logger';

const tableMap = {
  dharma: {
    timestampTable: DharmaDataCurrentTimestamp,
    dataTable: DharmaTableData,
  },
  compound: {
    timestampTable: CompoundDataCurrentTimestamp,
    dataTable: CompoundTableData,
  },
};

const cleanDataTable = async tableName => {
  log.info(`Cleaning table ${tableName}`);

  const currentBlock = await tableMap[tableName].timestampTable.find();
  if (currentBlock) {
    const newCurrentBlock = currentBlock[0].currentBlock;
    const result = await tableMap[tableName].dataTable.deleteMany({
      updateBlock: { $lt: newCurrentBlock },
    });
    log.info(`Removed ${result.deletedCount} records from ${tableName} table`);
  } else {
    log.info(`Couldn't find currentBlock from ${tableMap[tableName].timestampTable}`);
  }
};

export default cleanDataTable;
