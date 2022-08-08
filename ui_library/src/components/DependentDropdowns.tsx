import { useState, useEffect, useContext } from "react";
import { ReactReduxContext } from 'react-redux'
import {
    JsonSchema,
    ControlProps,
    isEnumControl,
    RankedTester,
    rankWith,
    and,
    schemaMatches
} from '@jsonforms/core';
import { Unwrapped } from '@jsonforms/material-renderers';
import { withJsonFormsEnumProps } from '@jsonforms/react';
import Grid from '@mui/material/Grid';

const { MaterialEnumControl } = Unwrapped;

type JsonSchemaWithDependentDropdowns = JsonSchema & { dependentComponent : JsonSchema, dependentEnum : any };

const DependentDropdowns = (props : ControlProps) : JSX.Element => {
    const data = props.data
    const schema = props.schema as JsonSchemaWithDependentDropdowns;
    const { store } = useContext(ReactReduxContext)
    console.log(store.getState())
    const handleChange = props.handleChange;
    const [subComponentSchema, setSubComponentSchema] = useState<any>({});
    const [subComponentPath, setSubComponentPath] = useState<string>("");
    const [subComponentValue, setSubComponentValue] = useState<any>(""); 
    useEffect(() => {
        const tempSchema : any = { ...schema.dependentComponent };
        setSubComponentPath(Object.keys(tempSchema)[0]);
    }, [data]);
    useEffect(() => {
        if(subComponentPath) {
            const subEnum = schema.dependentEnum[data];
            const tempSchema : any = schema.dependentComponent as any;
            setSubComponentSchema({
                ...tempSchema[subComponentPath], 
                enum: subEnum
            });
            setSubComponentValue("");
        }
    }, [subComponentPath, data])
    console.log(subComponentPath, subComponentSchema)
    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <MaterialEnumControl 
                    {...props}
                />
            </Grid>
            <Grid item xs={6}>
                <MaterialEnumControl
                    {...props}
                    schema={subComponentSchema}
                    path={subComponentPath}
                    data={subComponentValue}
                    handleChange={(path : string, value : any) => {
                        setSubComponentValue(value)
                        handleChange(subComponentPath, value)
                    }}
                    options={(Object.keys(subComponentSchema).length > 0 && subComponentSchema.enum) ? 
                        subComponentSchema.enum.map((item : any) => ({
                            label: item, value: item
                        })) 
                    : []}
                    label={(Object.keys(subComponentSchema).length > 0 && subComponentSchema.title) ? subComponentSchema.title : ""}
                />
            </Grid>
        </Grid>
    );
};

export const DependentDropdownsTester: RankedTester = rankWith(
    3,
    and(
        isEnumControl,
        schemaMatches((schema) => schema.hasOwnProperty('dependentComponent'))
    )
);

export default withJsonFormsEnumProps(DependentDropdowns);