export interface User {
    id: number;
    email: string;
    password: string;
}

export interface CreateUserData {
    email: string;
    password: string;
}

export interface PersistencePort {
    createUser(data: CreateUserData): Promise<User>;
    findUserByEmail(email: string): Promise<User | null>;
    findUserById(id: number): Promise<User | null>;
}
