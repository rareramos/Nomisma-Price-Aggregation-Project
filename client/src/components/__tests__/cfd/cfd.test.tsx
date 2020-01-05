import React from 'react';
import { shallow } from 'enzyme';
import {
  ICfdProps,
  ICfdTableProps,
} from 'types/components/cfd';

import { Cfd } from 'components/cfd/cfd';
import { CfdTable } from 'components/cfd/cfd-table';
import { cfdColumns } from 'utils';

const CfdProps : ICfdProps = {
  startQuasiLiveFetch: jest.fn,
};

const CfdTableProps : ICfdTableProps = {
  tableData: [],
  columns: cfdColumns,
  uniqueProviderNames: [],
  cfdHeader: [],
  cfdKey: [],
  cfdBody: [],
};

describe('CFD pipeline snapshot test', () => {
  it('matches cfd snapshot', () => {
    const wrapper = shallow(<Cfd {...CfdProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('matches cfd table snapshot', () => {
    const wrapper = shallow(<CfdTable {...CfdTableProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
