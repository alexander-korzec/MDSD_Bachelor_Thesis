import { Fragment } from "react";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Resource } from "../data/ResourceFile";
import { MasterDetailState, UIState } from "./UIState";
import Form from "./Form";
import Table from "./Table";
import { useAppSelector, useAppDispatch } from '../hooks';
import {
    clearForm,
    selectUIState,
    sendChangedItemToAPI,
    sendNewItemToAPI,
    selectIsSending,
    updateUIState
} from '../reducers/formReducer';

const MasterView = ({ res } : { res : Resource }) : JSX.Element => {
    const dispatch = useAppDispatch();
    const isSending : boolean = useAppSelector(selectIsSending);
    return (
        <Fragment>
            <Table
                res={res}
            />
            <Button
                variant="contained"
                endIcon={<AddIcon />}
                fullWidth
                onClick={() => dispatch(updateUIState(MasterDetailState.new))}
                disabled={isSending}
            >
                Create new entry
            </Button>
        </Fragment>
    );
};

const DetailView = ({ res, submitFunc, submitText } : { res : Resource, submitFunc : Function, submitText : string }) : JSX.Element => {
    const dispatch = useAppDispatch();
    const isSending : boolean = useAppSelector(selectIsSending);
    return (
        <Fragment>
            <Button
                variant="contained"
                endIcon={<ArrowBackIcon />}
                fullWidth
                onClick={() => { 
                    dispatch(updateUIState(MasterDetailState.overview)) 
                    dispatch(clearForm());
                }}
                disabled={isSending}
            >
                Return to previous screen
            </Button>
            <Form 
                res={res}
                submitFunc={submitFunc}
                submitText={submitText}
            />
        </Fragment>
    );
};

const CreateNewEntryView = ({ res } : { res : Resource }) : JSX.Element => {
    const dispatch = useAppDispatch();
    const createNewEntryOnSubmit = ({ resource, item } : { resource : Resource, item : any }) => {
        dispatch(sendNewItemToAPI({ resource, item }));
    };
    return (
        <DetailView 
            res={res}
            submitFunc={createNewEntryOnSubmit}
            submitText="Create new entry"
        />
    )
}

const EditEntryView = ({ res } : { res : Resource }) : JSX.Element => {
    const dispatch = useAppDispatch();
    const editEntryOnSubmit = ({ resource, item } : { resource : Resource, item : any }) => {
        dispatch(sendChangedItemToAPI({ resource, item }));
    };
    return (
        <DetailView 
            res={res}
            submitFunc={editEntryOnSubmit}
            submitText="Submit changes"
        />
    )
}

const UIView = ({ res, uistate } : { res : Resource, uistate : UIState }) => {
    switch(uistate) {
        case MasterDetailState.overview:
            return (
                <MasterView
                    res={res} 
                />
            );
        case MasterDetailState.new:
            return (
                <CreateNewEntryView 
                    res={res}
                />
            );
        case MasterDetailState.edit:
            return (
                <EditEntryView 
                    res={res}
                />
            );
        default:
            return <Fragment></Fragment>
    }
}

const MasterDetail = ({ res } : { res : Resource }) : JSX.Element => {
    const uistate : UIState = useAppSelector(selectUIState);
    return (
        <Fragment>
            <Typography variant="h3">
                {res.type}
            </Typography>
            <UIView
                res={res}
                uistate={uistate}
            />
        </Fragment>
    );
};

export default MasterDetail;