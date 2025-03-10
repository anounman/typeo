import { User } from './user';

export interface Room {
  id: string;
  users: User[];
  isActive: boolean; // Whether race is active
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}