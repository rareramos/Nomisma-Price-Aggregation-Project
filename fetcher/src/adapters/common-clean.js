import {
  DharmaTableData,
  DharmaDataCurrentTimestamp,
  DharmaTermsContractRepayParams,
  CompoundTableData,
  CompoundDataCurrentTimestamp,
  CompoundBalances,
  LoansTable,
  LoansTableTimestamp,
  MakerTableData,
  MakerDataCurrentTimestamp,
  MakerOutstandingBalances,
  MakerOutstandingFees,
} from 'price-aggregation-db';
import { log } from '../utils/logger';
import environment from '../../environment';

const { blockchain } = environment;

const tableMap = {
  dharma: {
    timestampTable: DharmaDataCurrentTimestamp,
    dataTable: DharmaTableData,
    balancesTable: DharmaTermsContractRepayParams,
  },
  compound: {
    timestampTable: CompoundDataCurrentTimestamp,
    dataTable: CompoundTableData,
    balancesTable: CompoundBalances,
  },
  loan: {
    timestampTable: LoansTableTimestamp,
    dataTable: LoansTable,
  },
  maker: {
    timestampTable: MakerDataCurrentTimestamp,
    dataTable: MakerTableData,
    balancesTable: [
      MakerOutstandingBalances,
      MakerOutstandingFees,
    ],
  },
};

const cleanDataTable = async (tableName) => {
  log.debug({
    message: `Cleaning table ${tableName}`,
  });

  const currentBlock = await tableMap[tableName].timestampTable.find();
  if (currentBlock) {
    const newCurrentBlock = currentBlock[0].currentBlock;
    const resultDataTable = await tableMap[tableName].dataTable.deleteMany({
      updateBlock: { $lt: newCurrentBlock },
    });

    log.debug({
      message: `Removed ${resultDataTable.deletedCount} records from ${tableName} table`,
    });

    if (tableName === 'maker') {
      tableMap[tableName].balancesTable.forEach(async (balanceTable) => {
        const resultBalancesTable = await balanceTable.deleteMany({
          updateBlock: { $lt: currentBlock - parseInt(blockchain.BALANCES_UPDATE_BLOCK_INTERVAL, 10) },
        });

        log.debug({
          message: `Removed ${resultBalancesTable.deletedCount} records from ${tableName} table`,
        });
      });
    } else {
      const resultBalancesTable = await tableMap[tableName].balancesTable.deleteMany({
        updateBlock: { $lt: currentBlock - parseInt(blockchain.BALANCES_UPDATE_BLOCK_INTERVAL, 10) },
      });

      log.debug({
        message: `Removed ${resultBalancesTable.deletedCount} records from ${tableName} table`,
      });
    }
  } else {
    log.error({
      message: `Couldn't find currentBlock from ${tableMap[tableName].timestampTable}`,
    });
  }
};

export default cleanDataTable;
