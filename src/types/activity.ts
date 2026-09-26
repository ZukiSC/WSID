export interface Activity {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export type PickState = 'idle' | 'shuffling' | 'revealed';
