import { Fragment, useState, useEffect } from "react";

import { Resource } from "../data/ResourceFile";
import { fetchElement } from "../data/Fetch";
import Form from "./Form";
import Table, { getTableAttributes, TableColumn } from "./Table";

const MasterDetail = (res : Resource) : JSX.Element => {
    const [uischema, setUISchema] = useState<any>(null);
    const [formState, setFormState] = useState<any>({});
    const [masterData, setMasterData] = useState<any>([]);
    const [masterFormat, setMasterFormat] = useState<TableColumn[]>([]);
    const [isSending, setIsSending] = useState(false);
    useEffect(() => {
        fetchElement(res, res.schemaPath)(setUISchema);
    }, [res]);
    useEffect(() => {
        fetchElement(res, res.type)(setMasterData);
    }, [res]);
    useEffect(() => {
        setMasterFormat(getTableAttributes(uischema));
    }, [uischema]);
    return (
        <Fragment> 
            { Form(res, uischema, formState, setFormState, masterData, setMasterData, isSending, setIsSending) }
            { Table(masterFormat, masterData, setFormState) }
        </Fragment>
    );
};

export default MasterDetail;