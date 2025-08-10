import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const users = [
    {
        id: "WDO7SFPJ45",
        name: "Admin",
        role: "ADMIN",
        image: "https://static.vecteezy.com/system/resources/previews/032/176/191/non_2x/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg",
        email: "admin@gmail.com",
        password: "123456",
    },
    {
        id: "DP742991XO",
        name: "User",
        role: "USER",
        image: "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png",
        email: "user@gmail.com",
        password: "123456",
    },
];

interface AuthStore {
    user: (typeof users)[0] | null;
    signin: (email: string, password: string) => (typeof users)[0] | null;
    signout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            signin: (email: string, password: string) => {
                const user = users.find((user) => user.email === email && user.password === password) || null;

                set({ user });
                return user;
            },
            signout: () => {
                set({ user: null });
            },
        }),
        {
            name: "newspaper-auth",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user }),
        }
    )
);
