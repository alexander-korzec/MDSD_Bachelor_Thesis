//@ts-nocheck

import { Fragment, useState, useEffect } from "react";
import { useTable } from 'react-table';
import styled from 'styled-components';

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
  }
`;

function ReactTable({ columns, data, onRowClick }) {
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
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} onClick={() => onRowClick(row.index) }>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
}

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

export const getTableAttributes = (obj : object | undefined) : TableColumn[] => {
    if(!obj) {
        return [];
    }
    const result : TableColumn[] = [];
    getAttributesHelper(obj, result);
    return result;
};

const getAttributesHelper = (obj : object, result : TableColumn[], identifier : string = "") : void => {
    if(!("properties" in obj)) {
        const atomarAttr : TableColumn = {
            Header: "",
            accessor: identifier
        }
        if("title" in obj) {
            atomarAttr.Header = obj["title" as keyof typeof obj];
        }
        result.push(atomarAttr);
    } else {
        const propertiesObj : object = obj["properties" as keyof typeof obj];
        Object.keys(propertiesObj).forEach((key : string) => {
            if(key !== "type") {
                getAttributesHelper(propertiesObj[key as keyof typeof propertiesObj], result, key);
            }
        });
    }
};

export interface TableColumn {
    Header: string,
    accessor: string
}

const Table = (tableFormat : TableColumn[], masterData : any[], setDetailState : Function) : JSX.Element => {
    const onRowClick = (idx : number) : void => {
        setDetailState(masterData[idx]);
    };
    const [flattenMasterData, setFlattenMasterData] = useState<any[]>([]);
    useEffect(() => {
        setFlattenMasterData(masterData.map(item => flattenJSON(item)))
    }, [masterData]);
    return (
      (masterData.length === 0 || tableFormat.length === 0) ? (
        <Fragment>Loading...</Fragment>
      ) : (
        <Fragment>
            <Styles>
                <ReactTable
                    columns={tableFormat}
                    data={flattenMasterData}
                    onRowClick={onRowClick}
                />
            </Styles>
        </Fragment>
      )
    );
}

export default Table;