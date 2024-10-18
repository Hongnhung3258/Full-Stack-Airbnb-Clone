import { useActiveList } from "../types";

export interface ActiveListStore {
    members: string[];
    add: (id: string ) => void;
    remove: (id: string ) => void;
    set: (ids: string[] ) => void;
};

export default useActiveList;