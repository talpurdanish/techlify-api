export class Filter {
  term: string = '';
  searchfield: number = 1;
  sortfield: number = 1;
  order: number = 1;
  id: number = 0;

  constructor(
    term: string,
    searchfield: number,
    sortfield: number,
    order: number,
    id: number = 0
  ) {
    this.term = term == null ? '' : term;
    this.searchfield = searchfield == 0 ? 1 : searchfield;
    this.sortfield = sortfield == 0 ? 1 : sortfield;
    this.order = order == 0 ? 1 : order;
    this.id = id;
  }

  public reset(): void {
    this.term = '';
    this.searchfield = 1;
    this.sortfield = 1;
    this.order = 1;
  }
}
