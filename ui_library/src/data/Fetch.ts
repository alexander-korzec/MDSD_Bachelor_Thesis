import axios from 'axios';
import { Resource, RemoteLocation } from "./ResourceFile";

const createPath = (remoteLocation : RemoteLocation, path : string) : string => {
    const protocol : string = (remoteLocation.protocol) ? remoteLocation.protocol : "http";
    const base : string = remoteLocation.address;
    const port : number = remoteLocation.port;
    return `${protocol}://${base}:${port}/${path}`;
}

const addParams = (url : String, params : [string, string][]) : string => {
    return [url].concat([params.map(x => (`${x[0]}=${x[1]}`)).join('&')]).join('?');
};

const setUIState = (apiPath : string) : Function => {
    return (
        async (setData : Function, searchParams : [string, string][] = []) => {
            try {
                let path = apiPath;
                if(searchParams.length > 0) {
                    path = addParams(path, searchParams);
                }
                const res = await axios.get(path);
                setData(res.data);
            } catch(err) {
                console.error(err);
            }
        }
    );
};

const addDataToAPI = (apiPath : string) : Function => (
    async (data : any) => {
        try {
            console.log(data)
            if("id" in data) {
                await axios.delete(`${apiPath}/${data.id}`);
            }
            await axios.post(apiPath, data);
        } catch(err) {
            console.error(err);
        }
    }
);

const genericReq = (resource : Resource, path : string = "", callback : Function) : Function => {
    const remoteLocation : RemoteLocation = resource.service;
    let remotePath : string = path;
    if(path === "") {
        remotePath = resource.type
    }
    const apiPath = createPath(remoteLocation, remotePath);
    return callback(apiPath);
};

export const fetchElement = (resource : Resource, path : string = "") : Function  => (
    genericReq(resource, path, setUIState)
);

export const addData = (resource : Resource, path : string = "") : Function => (
    genericReq(resource, path, addDataToAPI)
);