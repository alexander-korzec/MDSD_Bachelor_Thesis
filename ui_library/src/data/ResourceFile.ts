export interface RemoteLocation {
    protocol?: string,
    port: number,
    address: string
}

export interface Resource {
    type: string,
    service: RemoteLocation,
    schemaPath: string,
    uischemaPath?: string,
    createPath?: string,
    remotePath?: string,
    updatePath?: string,
    deletePath?: string
}

export interface ResourceFile {
    resources: Resource[]
}