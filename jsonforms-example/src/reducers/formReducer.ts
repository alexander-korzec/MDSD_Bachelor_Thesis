import axios from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { Resource } from './../data/ResourceFile';
import { deleteResource, getResource, patchResource, postItemToResource } from './../data/FormAPI';
import { TableColumn } from './../components/TableColumn';
import { MasterDetailState, UIState } from '../components/UIState';

export const deleteItemFromAPI = createAsyncThunk(
    'FormAPI/deleteItemFromAPI',
    async({ resource, item } : { resource : Resource, item : any }) => {
        let path = "";
        if(resource.deletePath) {
            path = resource.deletePath
        }
        await deleteResource(resource, item, path);
    }
);

export const getAllResourceData = createAsyncThunk(
    'FormAPI/getAllResourceData',
    async(resource : Resource) => {
        const response = await getResource(resource);
        return response.data; 
    }
);

export const getSchema = createAsyncThunk(
    'FormAPI/getSchema',
    async(resource : Resource) => {
        const response = await getResource(resource, resource.schemaPath);
        return response.data;
    }
);

export const getUISchema = createAsyncThunk(
    'FormAPI/getUISchema',
    async(resource : Resource) => {
        const response = await getResource(resource, resource.uischemaPath);
        return response.data;
    }
);

export const getGlobalValidationSchema = createAsyncThunk(
    'FormAPI/getGlobalValidationSchema',
    async(path : string) => {
        const response = await axios.get(path);
        const key = Object.keys(response.data)[0];
        return response.data[key];
    }
);

export const sendNewItemToAPI = createAsyncThunk(
    'FormAPI/sendNewItemToAPI',
    async({ resource, item } : { resource : Resource, item : any }) => {
        let path = "";
        if(resource.createPath) {
            path = resource.createPath
        }
        await postItemToResource(resource, item, path);
    }
);

export const sendChangedItemToAPI = createAsyncThunk(
    'FormAPI/sendChangedItemToAPI',
    async({ resource, item } : { resource : Resource, item: any }) => {
        await patchResource(resource, item);
    }
)

export const getTableAttributes = (obj : object | undefined) : TableColumn[] => {
    if(!obj) {
        return [];
    }
    const result : TableColumn[] = [];
    getAttributesHelper(obj, result);
    const dataManagementColumn = {
        Header: "Manage Item",
        columns: [
            {
                Header: "Edit",
                accessor: (x : any) : JSX.Element => x.editAction
            },
            {
                Header: "Delete",
                accessor: (x : any) : JSX.Element => x.deleteAction
            }
        ]
    };
    return [ 
        dataManagementColumn, 
        {
            Header: "Data",
            columns: result
        }
    ];
};

const getAttributesHelper = (obj : object, result : TableColumn[], identifier : string = "") : void => {
    if(!("properties" in obj)) {
        const atomarAttr : TableColumn = {
            Header: "",
            accessor: (x : any) : string => (identifier in x) ? x[identifier].toString() : ""
        }
        if("title" in obj) {
            atomarAttr.Header = obj["title" as keyof typeof obj];
        } else {
            atomarAttr.Header = identifier;
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

interface FormState {
    uistate: UIState,
    isSending: boolean,
    values: object,
    schema: object,
    uischema: object,
    data: any[],
    tableformat: TableColumn[],
    globalValidationPath: string,
    globalValidationSchema: object[]
}

const initialFormState : FormState = {
    uistate: MasterDetailState.overview,
    isSending: false,
    values: {},
    schema: {},
    uischema: {},
    data: [],
    tableformat: [],
    globalValidationPath: "",
    globalValidationSchema: []
}

export const formSlice = createSlice({
    name: "form",
    initialState: initialFormState,
    reducers: {
        clearForm: (state) => {
            state.values = {};
        },
        resetEverything: (state) => {
            state.uistate = initialFormState.uistate;
            state.values = initialFormState.values;
            state.schema = initialFormState.schema;
            state.uischema = initialFormState.uischema;
            state.data = initialFormState.data;
            state.tableformat = initialFormState.tableformat;
        },
        updateFormState: (state, action: PayloadAction<any>) => {
            state.values = action.payload;
        },
        updateUIState: (state, action: PayloadAction<MasterDetailState>) => {
            state.uistate = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getSchema.pending, state => {
                state.schema = {};
                state.isSending = true;
            })
            .addCase(getSchema.fulfilled, (state, action) => {
                state.schema = action.payload;
                state.tableformat = getTableAttributes(action.payload);
                state.isSending = false;
            })
            .addCase(getSchema.rejected, state => {
                state.isSending = false;
            })
            .addCase(getUISchema.pending, state => {
                state.uischema = {};
                state.isSending = true;
            })
            .addCase(getUISchema.fulfilled, (state, action) => {
                state.uischema = action.payload;
                state.isSending = false;
            })
            .addCase(getUISchema.rejected, state => {
                state.isSending = false;
            })
            .addCase(getAllResourceData.pending, state => {
                state.data = [];
                state.isSending = true;
            })
            .addCase(getAllResourceData.fulfilled, (state, action) => {
                state.data = action.payload.data;
                // Custom validation keyword
                state.globalValidationPath = action.payload.meta ? action.payload.meta.validation : ""
                state.isSending = false;
            })
            .addCase(getAllResourceData.rejected, state => {
                state.isSending = false;
            })
            .addCase(getGlobalValidationSchema.pending, state => {
                state.isSending = true;
            })
            .addCase(getGlobalValidationSchema.fulfilled, (state, action) => {
                state.isSending = false;
                state.globalValidationSchema = action.payload
            })
            .addCase(getGlobalValidationSchema.rejected, state => {
                state.isSending = false;
            })
            .addCase(sendNewItemToAPI.pending, state => {
                state.isSending = true;
            })
            .addCase(sendNewItemToAPI.fulfilled, (state, action) => {
                state.isSending = false;
            })
            .addCase(sendNewItemToAPI.rejected, state => {
                state.isSending = false;
            })
            .addCase(sendChangedItemToAPI.pending, state => {
                state.isSending = true;
            })
            .addCase(sendChangedItemToAPI.fulfilled, (state, action) => {
                state.isSending = false;
            })
            .addCase(sendChangedItemToAPI.rejected, state => {
                state.isSending = false;
            })
            .addCase(deleteItemFromAPI.pending, state => {
                state.isSending = true;
            })
            .addCase(deleteItemFromAPI.fulfilled, (state, action) => {
                state.isSending = false;
            })
            .addCase(deleteItemFromAPI.rejected, state => {
                state.isSending = false;
            })
    }
});

export const selectFormState = (state: RootState) : object => state.form.values;
export const selectFormSchema = (state: RootState) : object => state.form.schema;
export const selectFormUISchema = (state: RootState) : object => state.form.uischema;
export const selectFormData = (state: RootState) : any[] => state.form.data;
export const selectTableFormat = (state: RootState) : TableColumn[] => state.form.tableformat;
export const selectIsSending = (state : RootState) : boolean => state.form.isSending;
export const selectUIState = (state : RootState) : UIState => state.form.uistate;
export const selectGlobalValidationPath = (state : RootState) : string => state.form.globalValidationPath;
export const selectGlobalValidationSchema = (state : RootState) : object => state.form.globalValidationSchema;

export const { clearForm, resetEverything, updateUIState, updateFormState } = formSlice.actions;

export default formSlice.reducer;