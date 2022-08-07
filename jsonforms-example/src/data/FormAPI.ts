import axios from 'axios';
import { Resource, RemoteLocation } from "./ResourceFile";

interface RequestOptions {
    path: string,
    id?: string,
    data?: any,
    searchParams?: [string, string][]
}

const createPath = (remoteLocation : RemoteLocation, path : string) : string => {
    const protocol : string = (remoteLocation.protocol) ? remoteLocation.protocol.toLowerCase() : "http";
    const base : string = remoteLocation.address.toLowerCase();
    const port : number = remoteLocation.port;
    return `${protocol}://${base}:${port}/${path.toLowerCase()}`;
}

const addParams = (url : string, params : [string, string][] | undefined) : string => {
    if(params && params.length > 0) {
        return [url].concat([params.map(x => (`${x[0]}=${x[1]}`)).join('&')]).join('?');
    }
    return url;
};

const postItem = (apiPath : string, options : RequestOptions) : Promise<void> => {
    return new Promise<void>((resolve : Function) => {
        axios.post(apiPath, options.data)
            .then((res : any) => resolve(res))
            .catch((error : any) => {
                console.log(error);
            });
    })
}

const getItem = (apiPath : string, options : RequestOptions) : Promise<any> => {
    return new Promise<any>((resolve : Function) => {
        const path = addParams(apiPath, options.searchParams);
        axios.get(path)
            .then((res : any) => resolve(res))
            .catch((error : any) => {
                console.log(error);
            });
    })
}

const patchItem = (apiPath : string, options : RequestOptions) : Promise<void> => {
    let data = { ...options.data };
    const id = data.id;
    delete data.id;
    const path = `${apiPath}/${id}`;
    return new Promise<void>((resolve : Function) => {
        axios.patch(path, data)
            .then((res : any) => resolve(res))
            .catch((error : any) => {
                console.log(error);
            });
    });
}

const deleteItem = (apiPath : string, options: RequestOptions) : Promise<void> => {
    let data = { ...options.data };
    const id = data.id;
    delete data.id;
    const path = `${apiPath}/${id}`;
    return new Promise<void>((resolve : Function) => {
        axios.delete(path)
            .then((res : any) => resolve(res))
            .catch((error : any) => {
                console.log(error);
            })
    });
}

const genericReq = (resource : Resource, options : RequestOptions, callback : Function) : Promise<any> => {
    const remoteLocation : RemoteLocation = resource.service;
    let remotePath : string = options.path;
    if(remotePath === "") {
        remotePath = resource.type
    }
    const apiPath = createPath(remoteLocation, remotePath);
    return callback(apiPath, options);
};

export const patchResource = (resource : Resource, data : any, path : string = "") : Promise<void> => {
    const options : RequestOptions = {
        path,
        data
    };
    return genericReq(resource, options, patchItem);
};

export const getResource = (resource : Resource, path : string = "", searchParams : [string, string][] = []) : Promise<any> => {
    const options : RequestOptions = {
        path,
        searchParams
    };
    return genericReq(resource, options, getItem);
};

export const postItemToResource = (resource : Resource, item : any, path : string = "") : Promise<void> => {
    const options : RequestOptions = {
        path,
        data: item
    };
    return genericReq(resource, options, postItem);
};

export const deleteResource = (resource : Resource, item : any, path : string = "") : Promise<void> => {
    const options : RequestOptions = {
        path,
        data: item
    };
    return genericReq(resource, options, deleteItem);
}