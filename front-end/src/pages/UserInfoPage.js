import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';

export const UserInfoPage = () => {
    const history = useHistory();
    const initialUser = useUser(); // Fetch initial user data
    const [token] = useToken();

    // Local component state for user info, allowing updates within this component
    const [userInfo, setUserInfo] = useState({
        favoriteFood: initialUser?.info?.favoriteFood || '',
        hairColor: initialUser?.info?.hairColor || '',
        bio: initialUser?.info?.bio || '',
    });

    const { favoriteFood, hairColor, bio } = userInfo;

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        if (showSuccessMessage || showErrorMessage) {
            setTimeout(() => {
                setShowSuccessMessage(false);
                setShowErrorMessage(false);
            }, 3000);
        }
    }, [showSuccessMessage, showErrorMessage]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const saveChanges = async () => {
        try {
            await axios.put(`/api/users/${initialUser.id}`, {
                favoriteFood,
                hairColor,
                bio,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Assume the server updates the user info correctly; reflect this in local state
            setShowSuccessMessage(true);
        } catch (error) {
            setShowErrorMessage(true);
        }
    };

    const logOut = () => {
        localStorage.removeItem('token');
        history.push('/login');
    };

    const resetValues = () => {
        setUserInfo({
            favoriteFood: initialUser?.info?.favoriteFood || '',
            hairColor: initialUser?.info?.hairColor || '',
            bio: initialUser?.info?.bio || '',
        });
    };

    return (
        <div className="content-container">
            <h1>Info for {initialUser?.email}</h1>
            {showSuccessMessage && <div className="success">Successfully saved user data!</div>}
            {showErrorMessage && <div className="fail">Uh oh... something went wrong and we couldn't save changes</div>}
            <label>
                Favorite Food:
                <input
                    name="favoriteFood"
                    onChange={handleInputChange}
                    value={favoriteFood} />
            </label>
            <label>
                Hair Color:
                <input
                    name="hairColor"
                    onChange={handleInputChange}
                    value={hairColor} />
            </label>
            <label>
                Bio:
                <input
                    name="bio"
                    onChange={handleInputChange}
                    value={bio} />
            </label>
            <hr />
            <button onClick={saveChanges}>Save Changes</button>
            <button onClick={resetValues}>Reset Values</button>
            <button onClick={logOut}>Log Out</button>
        </div>
    );
};
