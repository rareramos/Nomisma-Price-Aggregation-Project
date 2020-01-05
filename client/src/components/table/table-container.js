import {connect} from 'react-redux';
import { CustomPaginationTable as PaginationTable } from './table';


const mapStateToProps = state => state.getTable;
const mapDispatchToProps = null;

export const CustomPaginationTable = connect(mapStateToProps, mapDispatchToProps)(PaginationTable);
