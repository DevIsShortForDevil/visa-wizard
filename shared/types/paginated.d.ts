interface Paginated<T> {
  items: T[];
  total: number;
  more: boolean;
}
