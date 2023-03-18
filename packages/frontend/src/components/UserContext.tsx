import { createContext } from 'react';
import { User } from 'shared-data';

export const UserContext = createContext({
    user: {
        id: -1,
        username: ""
    },
});
