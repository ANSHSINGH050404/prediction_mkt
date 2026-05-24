import React from 'react';
import UserContext from './UserContext';



type UserContextProviderProps = {
    children: React.ReactNode;
};

const UserContextProvider = ({ children }: UserContextProviderProps) => {

    const [user, setUser] = React.useState('');

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}


export default UserContextProvider;