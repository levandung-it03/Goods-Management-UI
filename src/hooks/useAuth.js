import { AuthContext } from '@src/context/AuthContext';
import { useContext } from 'react';

// context = {
//     auth: {
//         accessToken: '',
//         refreshToken: '',
//     },
//     login: ()=>{},
//     logout: ()=>{},
//     ...
// }

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
