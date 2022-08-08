export enum MasterDetailState {
    overview = "OVERVIEW",
    edit = "EDIT",
    new = "NEW"
};

export type UIState = MasterDetailState.overview | MasterDetailState.edit | MasterDetailState.new;