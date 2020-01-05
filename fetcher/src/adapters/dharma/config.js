import path from 'path';
import fs from 'fs';
import { getContract } from '../generic';
import environment from '../../../environment';


export const debtOrderFilledEventName = 'LogDebtOrderFilled';
export const insertEntryEventName = 'LogInsertEntry';
export const collateralLockedEventName = 'CollateralLocked';
export const interestTermStartEventName = 'LogSimpleInterestTermStart';
export const termRepayEventName = 'LogRegisterRepayment';
export const routerRepayEventName = 'LogRepayment';

export const dharmaEventNamesToColumnNamesMapDebtKernel = {
  [debtOrderFilledEventName]: 'dharma-debt-order-filled',
};

export const dharmaEventNamesToColumnNamesMapDebtRegistry = {
  [insertEntryEventName]: 'dharma-debt-insert-entry',
};

export const dharmaEventNamesToColumnNamesMapTermsContract = {
  [interestTermStartEventName]: 'dharma-interest-term-start',
  [termRepayEventName]: 'dharma-register-repayment',
};

export const dharmaEventNamesToColumnsMapCollateralizer = {
  [collateralLockedEventName]: 'dharma-collateral-locked',
  'CollateralReturned': 'dharma-collateral-returned',
  'CollateralSeized': 'dharma-collateral-seized',
};

export const dharmaEventNameToColumnsMapRepaymentRouter = {
  [routerRepayEventName]: 'dharma-repayment-router-repays',
};

const debtKernelAbiPath = path.resolve(__dirname, './debt-kernel-abi.json');
const collateralisedTermsAbiPath = path.resolve(__dirname, './collateralised-terms-abi.json');
const ltvCreditorProxyAbiPath = path.resolve(__dirname, './ltv-creditor-proxy-abi.json');
const debtRegistryAbiPath = path.resolve(__dirname, './debt-registry-abi.json');
const collateraliserAbiPath = path.resolve(__dirname, './collateraliser-abi.json');
const repaymentRouterAbiPath = path.resolve(__dirname, './repayment-router-abi.json');

export const debtKernelAbi = fs.readFileSync(debtKernelAbiPath, 'utf8');
export const collateralisedTermsAbi = fs.readFileSync(collateralisedTermsAbiPath, 'utf8');
export const ltvCreditorProxyAbi = fs.readFileSync(ltvCreditorProxyAbiPath, 'utf8');
const debtRegistryAbi = fs.readFileSync(debtRegistryAbiPath, 'utf8');
const collateraliserAbi = fs.readFileSync(collateraliserAbiPath, 'utf8');
const repaymentRouterAbi = fs.readFileSync(repaymentRouterAbiPath, 'utf8');

export const getDebtKernelContract = () => getContract({
  abi: debtKernelAbi,
  contractAddress: environment.blockchain.DHARMA_DEBT_KERNEL_ADDRESS,
});

export const getDebtRegistryContract = () => getContract({
  abi: debtRegistryAbi,
  contractAddress: environment.blockchain.DHARMA_DEBT_REGISTRY_ADDRESS,
});

export const getCollateraliserContract = () => getContract({
  abi: collateraliserAbi,
  contractAddress: environment.blockchain.DHARMA_COLLATERALISER_ADDRESS,
});

export const getRepaymentRouterContract = () => getContract({
  abi: repaymentRouterAbi,
  contractAddress: environment.blockchain.DHARMA_REPAYMENT_ROUTER_ADDRESS,
});
