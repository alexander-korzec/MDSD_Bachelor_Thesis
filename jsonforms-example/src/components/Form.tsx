import { Fragment, useEffect, useRef, useCallback } from "react";
import {
    materialCells,
    materialRenderers,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { makeStyles } from "@mui/styles";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import BuildIcon from '@mui/icons-material/Build';

import { Resource } from "../data/ResourceFile";
import { addData, fetchElement } from "../data/Fetch";

const useStyles = makeStyles({
    container: {
        padding: "1em",
        width: "100%",
    },
    title: {
        textAlign: "center",
        padding: "0.25em",
    },
    dataContent: {
        display: "flex",
        justifyContent: "center",
        borderRadius: "0.25em",
        backgroundColor: "#cecece",
        marginBottom: "1rem",
    },
    resetButton: {
        margin: "auto !important",
        display: "block !important",
    },
    form: {
        margin: "auto",
        padding: "1rem",
    },
});

const renderers = [
    ...materialRenderers
];

const Form = (res : Resource, uischema : any, formState : any, setFormState : Function, masterData : any[], setMasterData : Function, isSending : boolean, setIsSending : Function) => {
    const classes = useStyles();
    const isMounted = useRef(true);
    const refreshMasterData = useCallback(async (item) => {
        if (isSending) {
            return;
        }
        setIsSending(true);
        await addData(res, res.type)(item);
        await fetchElement(res, res.type)(setMasterData);
        if(isMounted.current) {
            setIsSending(false);
        }
        setFormState({})
    }, [isSending]);
    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, []);
    return (
        !(uischema) ? (
            <Fragment>Loading...</Fragment>
        ) : (
            <Fragment>
            <div className={classes.form}>
                <JsonForms
                    schema={uischema}
                    data={formState}
                    renderers={renderers}
                    cells={materialCells}
                    onChange={({ errors, data }) => setFormState(data)}
                />
            </div>
            <Button
                variant="contained"
                endIcon={<BuildIcon />}
                onClick={() => refreshMasterData(formState)}
                disabled={isSending}
                fullWidth
            >
                Edit
            </Button>
            <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={() => {
                    const formState2 = { ...formState};
                    if("id" in formState2) {
                        delete formState2["id" as keyof typeof formState2];
                    }
                    refreshMasterData(formState2);
                }}
                disabled={isSending}
                fullWidth
            >
                Submit
            </Button>
        </Fragment>
        )
    );
};

export default Form;