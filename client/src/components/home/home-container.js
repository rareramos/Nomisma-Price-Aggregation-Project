import { connect } from 'react-redux';
import { updateTablePage, sortTableBy } from '../../actions/table';
import { selectTablePageCountSelector } from '../../selectors/table/meta';

import { Home as HomeComponent } from './home';
import { selectDisplayTableRecordsFromState } from '../../selectors/table/data';
import { selectTableLoadingSelector } from '../../selectors/table/loading';
import { selectTableFilter } from '../../selectors/table';
import { getEnabledColumns } from '../../utils/enabled-columns';

const mapStateToProps = state => ({
  loading: selectTableLoadingSelector(state),
  tableData: selectDisplayTableRecordsFromState(state),
  pageCount: selectTablePageCountSelector(state),
  filter: selectTableFilter(state),
  columns: getEnabledColumns(),
});

export const Home =  connect(
  mapStateToProps,
  {
    handlePageChange: ( selected ) => updateTablePage(selected),
    sortByColumn: (column) => sortTableBy(column),
  }
)(HomeComponent);
