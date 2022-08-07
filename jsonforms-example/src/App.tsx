import React, { useState, Fragment } from "react";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import "./App.css";
import { Provider } from 'react-redux';
import { store } from './store';
import MasterDetail from './components/MasterDetail';
import resourceFileLocal from './data/ResourceFile.json';
import { ResourceFile, Resource } from "./data/ResourceFile";
import { useAppDispatch } from './hooks';
import { resetEverything } from './reducers/formReducer';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {(value === index) && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const MasterDetailOverview = ({ resourceFile } : { resourceFile : ResourceFile }) => {
    const dispatch = useAppDispatch();
    // eslint-disable-next-line
    const [resFile, setResFile] = useState<ResourceFile>(resourceFile);
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        dispatch(resetEverything());
        setValue(newValue);
    };
    return (
        <Fragment>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        {
                            resFile.resources.map((res : Resource, idx : number) => (
                                <Tab 
                                    label={res.type}
                                    {...a11yProps(idx)}
                                />
                            ))
                        }
                    </Tabs>
                </Box>
                {
                    resFile.resources.map((res : Resource, idx : number) => (
                        <TabPanel value={value} index={idx}>
                            <MasterDetail
                                res={res}
                            />
                        </TabPanel>
                    ))
                }
            </Box>
        </Fragment>
    );
}

const App = () => {
    return (
        <React.StrictMode>
            <Provider store={store}>
                <MasterDetailOverview
                    resourceFile={resourceFileLocal as unknown as ResourceFile}
                />
            </Provider>
        </React.StrictMode>
    );
}

export default App;