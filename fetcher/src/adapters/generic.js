/* eslint-disable import/no-extraneous-dependencies */
import Web3 from 'web3';
import { utils } from '@nomisma/nomisma-contracts-sdk';
import { CallMethod } from 'web3-core-method';
import * as Utils from 'web3-utils';
import { formatters } from 'web3-core-helpers';
import environment from '../../environment';

const { convertBigNumberToString } = utils;

const getProviderUrl = env => env.PROVIDER_URL;

export const getWeb3 = () => {
  const providerUrl = getProviderUrl(environment.blockchain);
  return new Web3(new Web3.providers.HttpProvider(providerUrl));
};

const getContractData = web3 => ({
  contractAddress,
  abi,
}) => {
  const underlyingContract = new web3.eth.Contract(
    JSON.parse(abi),
    contractAddress,
  );
  return new Proxy(underlyingContract, {
    get(target, prop) {
      let toReturn;
      if (prop === 'getPastEvents') {
        toReturn = async (...args) => {
          const resultArr = await target.getPastEvents(...args);
          return resultArr.map((item) => {
            if (
              !!item.returnValues
              && !!Object.entries(item.returnValues).length
            ) {
              item.returnValues = Object.entries(item.returnValues).reduce((acc, [propName, value]) => ({
                ...acc,
                [propName]: convertBigNumberToString(
                  value,
                  web3.utils.isBN,
                ),
              }), {});
            }
            return item;
          });
        };
      } else if (prop === 'then') {
        return this;
      } else if (typeof target[prop] === 'function') {
        toReturn = (...args) => target[prop](...args);
      } else {
        toReturn = target[prop];
      }
      return toReturn;
    },
  });
};

export const dataToCallMethod = ({
  data,
  contractAddress,
}) => {
  const method = new CallMethod(Utils, formatters, {});
  method.setArguments([{ to: contractAddress, data }, () => {}]);
  return method;
};

export const getContract = (...rest) => getContractData(getWeb3())(...rest);
