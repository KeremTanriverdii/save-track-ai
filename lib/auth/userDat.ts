import { User, UserSettings } from "../types/type";
import { getUserData } from "./user"

export const getSettings = async (): Promise<UserSettings> => {
    const user = await getUserData();
    if (!user) return { displayName: '', email: '', photoURL: '', currency: '' };
    const data: UserSettings = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        currency: user.currency

    }
    return data;
}