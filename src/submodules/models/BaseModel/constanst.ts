export interface Modified {
    createdAt?: Date;
    updatedAt?: Date;
    deleteAt?: Date | null;
    status?: number;
}
export type DateModified = Omit<Modified, 'trashed' | 'status'>;

export type Nullable<T> = { [K in keyof T]: T[K] | null };
