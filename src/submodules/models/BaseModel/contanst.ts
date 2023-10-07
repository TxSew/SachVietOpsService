export interface Modified {
  createdAt?: Date;
  updatedAt?: Date;
  deleteAt?: Date | null;
  status?: number;
}
export type DateModified = Omit<Modified, 'trashed' | 'status'>;
