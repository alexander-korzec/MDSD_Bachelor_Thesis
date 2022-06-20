import { Fragment, useState, useEffect } from "react";
import { JsonForms } from "@jsonforms/react";
import Button from "@mui/material/Button";
import "./App.css";
import axios from "axios";
import {
    materialCells,
    materialRenderers,
} from "@jsonforms/material-renderers";
import RatingControl from "./RatingControl";
import ratingControlTester from "./ratingControlTester";
import { makeStyles } from "@mui/styles";
import $RefParser from "@apidevtools/json-schema-ref-parser";

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
    demoform: {
        margin: "auto",
        padding: "1rem",
    },
});

const renderers = [
    ...materialRenderers,
    //register custom renderers
    { tester: ratingControlTester, renderer: RatingControl },
];

const useFetch = (url: string) => {
    const [schema, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(url);
                let schema_ref = await $RefParser.dereference(res.data);
                setData(schema_ref);
            } catch (err) {
                setError(err);
            }
        })();
    }, [url]);
    return { schema, error };
};

const App = () => {
    const classes = useStyles();
    const [formData, setFormData] = useState<any>({});
    let req = useFetch("http://192.168.178.12:80/schemas/schema.json");
    if (req.error) {
        console.log(req.error);
    }
    const schema = req.schema;
    req = useFetch("http://192.168.178.12:80/schemas/uischema.json");
    if (req.error) {
        console.log(req.error);
    }
    const uischema = req.schema;
    return !schema || !uischema ? (
        <Fragment>Loading...</Fragment>
    ) : (
        <Fragment>
            <div className={classes.demoform}>
                <JsonForms
                    schema={schema}
                    uischema={uischema}
                    data={formData}
                    renderers={renderers}
                    cells={materialCells}
                    onChange={({ errors, data }) => setFormData(data)}
                />
            </div>
            <Button fullWidth variant="contained">
                Submit
            </Button>
        </Fragment>
    );
};

export default App;
