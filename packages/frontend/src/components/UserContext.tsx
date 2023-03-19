import { createContext } from 'react';
import { User } from 'shared-data';
import { WebLNProvider } from 'webln';

interface _User {
    userContext: {
        user: User,
        webln: WebLNProvider | null,
        nodeAlias: string,
        nodePubkey: string,
    }
}

export const UserContext = createContext<_User>({
    userContext: {
        user: {
            id: -1,
            username: ""
        },
        webln: null,
        nodeAlias: "",
        nodePubkey: ""
    }
});
