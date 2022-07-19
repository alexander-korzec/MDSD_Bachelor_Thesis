import "./App.css";
import MasterDetail from './components/MasterDetail';
import resourceFileLocal from './data/ResourceFile.json';
import { useState, Fragment } from "react";
import { ResourceFile, Resource } from "./data/ResourceFile";

const App = () => {
    const [resFile, setResFile] = useState<ResourceFile>(resourceFileLocal as unknown as ResourceFile);
    return (
        <Fragment>
            {
                resFile.resources.map((res : Resource) => {
                    return MasterDetail(res);
                })
            }
        </Fragment>
    );
}

export default App;

