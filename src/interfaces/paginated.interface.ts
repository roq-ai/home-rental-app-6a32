export interface PaginatedInterface<T> {
  filter(filterMatches: (item: import("./property").PropertyInterface) => boolean): unknown;
  data: T[];
  totalCount: number;
}
