export interface Modified {
  createdAt?: Date;
  updatedAt?: Date;
  deleteAt?: Date | null | undefined | boolean | number;
  status?: number;
}
export type DateModified = Omit<Modified, 'trashed' | 'status'>;
