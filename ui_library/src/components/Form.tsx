import { Fragment, useEffect, useState } from "react";
import { ErrorObject } from "ajv";
import {
    materialCells,
    materialRenderers,
} from "@jsonforms/material-renderers";
import { createAjv } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";
import { makeStyles } from "@mui/styles";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

import { useAppSelector, useAppDispatch } from '../hooks';
import {
    clearForm,
    getSchema,
    getUISchema,
    getGlobalValidationSchema,
    selectIsSending,
    selectFormSchema,
    selectFormState,
    selectFormUISchema,
    selectGlobalValidationPath,
    selectGlobalValidationSchema,
    updateFormState,
    updateUIState
} from '../reducers/formReducer';
import { Resource } from "../data/ResourceFile";
import { MasterDetailState } from "./UIState";
import DependentDropdowns, { DependentDropdownsTester } from './DependentDropdowns';

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
    { tester: DependentDropdownsTester, renderer: DependentDropdowns },
    ...materialRenderers
];

const isEmptyObj = (obj : object) : boolean => Object.keys(obj).length === 0;
const P = (obj : object) : boolean => obj && !isEmptyObj(obj);
const isLoading = (res : Resource, x : object, y : object) : boolean => (
    !P(x) && (!("uischemaPath" in res) || !P(y))
);

const validate = (expr : any) => {
    console.log(expr)
    return true;
}

const ajv = createAjv({
    formats: {
        path: validate
    }
});

const Form = ({ res, submitFunc, submitText } : { res : Resource, submitFunc : Function, submitText : string }) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const formState = useAppSelector(selectFormState);
    const formSchema = useAppSelector(selectFormSchema);
    const formUISchema = useAppSelector(selectFormUISchema);
    const isSending = useAppSelector(selectIsSending);
    const globalValidationPath = useAppSelector(selectGlobalValidationPath);
    const globalValidationSchema = useAppSelector(selectGlobalValidationSchema);
    useEffect(() => {
        if(globalValidationPath) {
            dispatch(getGlobalValidationSchema(globalValidationPath));
        }
    }, [globalValidationPath, dispatch]);
    useEffect(() => {
        dispatch(getSchema(res));
        if("uischemaPath" in res) {
            dispatch(getUISchema(res));
        }
    }, [res, dispatch]);
    let jsonFormsOptions : any = {
        schema: formSchema,
        data: formState,
        renderers: renderers,
        cells: materialCells,
        onChange: ({ errors, data } : { errors : any, data : any }) => dispatch(updateFormState(data)),
    }
    if(P(formUISchema)) {
        jsonFormsOptions.uischema = formUISchema;
    }
    return (
        (isLoading(res, formSchema, formUISchema)) ? (
            <Fragment>Loading...</Fragment>
        ) : (
            <Fragment>
                <div className={classes.form}>
                    <JsonForms
                        { ...jsonFormsOptions }
                        ajv={ajv}
                    />
                </div>
                <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    disabled={isSending}
                    fullWidth
                    onClick={() => {
                        submitFunc({ resource: res, item: formState });
                        dispatch(clearForm());
                        dispatch(updateUIState(MasterDetailState.overview));
                    }}
                >
                    { submitText }
                </Button>
            </Fragment>
        )
    );
};

export default Form;