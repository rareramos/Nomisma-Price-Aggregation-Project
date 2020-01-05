import { selectTableFromState } from './index';
import { getEnabledColumns } from '../../utils/enabled-columns';

export const selectTableDataFromState = state => selectTableFromState(state).data;

export const selectDisplayTableRecordsFromState = (state) => {
  const data = selectTableDataFromState(state);
  let toReturn;
  if (data && data.length) {
    const columns = getEnabledColumns();
    toReturn = data.map(item => columns.reduce((acc, column) => {
      let propValue;
      if (column.selector) {
        propValue = column.selector(item);
      } else if (column.render) {
        propValue = column.render(item);
      } else {
        propValue = item[column.key];
      }
      return {
        ...acc,
        [column.key]: propValue,
      };
    }, {}));
  } else {
    toReturn = [];
  }
  return toReturn;
};
