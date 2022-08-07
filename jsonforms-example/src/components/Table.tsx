import { Fragment, useState, useEffect } from "react";
import { useTable } from 'react-table';
import styled from 'styled-components';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

import { useAppSelector, useAppDispatch } from '../hooks';
import {
    deleteItemFromAPI,
    getAllResourceData,
    getSchema,
    selectFormData,
    selectTableFormat,
    updateFormState,
    updateUIState
} from '../reducers/formReducer';
import { Resource } from "../data/ResourceFile";
import { MasterDetailState } from './UIState';

const Styles = styled.div`
    padding: 1rem;
    table {
        border-spacing: 0;
        border: 1px solid black;
    tr {
        :last-child {
            td {
                border-bottom: 0;
            }
        }
    }
    th,
    td {
        margin: 0;
        padding: 0.5rem;
        border-bottom: 1px solid black;
        border-right: 1px solid black;
        :last-child {
            border-right: 0;
        }
    }
}`;

const TableWrapper = styled.div`
    width: 100%;
    marginTop: 3;
    overflow: auto;
`;

function ReactTable({ columns, data, } : { columns : any, data : any }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns,
        data,
    })
    return (
        <table {...getTableProps()}>
            <thead>
                {
                    headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {
                                headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>
                                        {
                                            column.render('Header')
                                        }
                                    </th>
                                ))
                            }
                        </tr>
                    ))
                }
            </thead>
            <tbody {...getTableBodyProps()}>
                {
                    rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()} /* onClick={() => onRowClick(row.index) } */>
                                {
                                    row.cells.map(cell => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })
                                }
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
};

const flattenJSON = (obj : object = {}, res : object = {}) => {
    Object.keys(obj).forEach(key =>  {
        if(typeof obj[key as keyof typeof obj] !== 'object') {
            res[key as keyof typeof obj] = obj[key as keyof typeof obj];
        } else {
            flattenJSON(obj[key as keyof typeof obj], res);
        }
    });
    return res;
};

const flattenData = (data : object[]) => data.map(item => flattenJSON(item));

const EditButton = (idx : number, onClickAction : Function) : JSX.Element => (
    <IconButton 
        aria-label={`edit-${idx}`}
        onClick={() => onClickAction(idx)}
    >
        <EditIcon />
    </IconButton>
);

const DeleteButton = (idx : number, onClickAction : Function) : JSX.Element => (
    <IconButton 
        aria-label={`delete-${idx}`}
        onClick={() => onClickAction(idx)}
    >
        <DeleteIcon />
    </IconButton>
);

const Table = ({ res } : { res : Resource }) : JSX.Element => {
    const dispatch = useAppDispatch();
    const tableColumns = useAppSelector(selectTableFormat);
    const tableData = useAppSelector(selectFormData);
    const onEditButtonClick = (idx : number) : void => {
        const item = tableData[idx];
        dispatch(updateFormState({
            id: item["id" as keyof typeof item],
            ...item.attributes
        }));
        dispatch(updateUIState(MasterDetailState.edit));
    };
    const onDeleteButtonClick = async (idx : number) => {
        await dispatch(deleteItemFromAPI({
            resource: res,
            item: tableData[idx]
        }));
        dispatch(getAllResourceData(res));
    }
    const [flatTableData, setFlatTableData] = useState<any[]>([]);
    useEffect(() => {
        dispatch(getSchema(res));
        dispatch(getAllResourceData(res));
    }, [dispatch, res]);
    useEffect(() => {
        setFlatTableData(flattenData(tableData).map((item : object, idx : number) : object => (
            {
                editAction: EditButton(idx, onEditButtonClick),
                deleteAction: DeleteButton(idx, onDeleteButtonClick),
                ...item
            }
        )));
    }, [tableData]);
    return (
        (tableColumns.length === 0) ? (
            <Fragment>Loading...</Fragment>
        ) : (
            <Fragment>
                <Styles>
                    <TableWrapper>
                        <ReactTable
                            columns={tableColumns}
                            data={flatTableData}
                        />
                    </TableWrapper>
                </Styles>
            </Fragment>
        )
    );
}

export default Table;