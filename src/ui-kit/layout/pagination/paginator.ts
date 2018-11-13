export class Paginator {

  public unit = 'Items';

  private _currentPage: number;
  private _totalUnits: number;
  private _unitsPerPage: number;

  constructor (unitName: string,
      unitsPerPage: number,
      total: number,
      current?: number) {
    this.unit = unitName;
    this.setUnitsPerPage(unitsPerPage || 10);
    this.setTotalUnits(total || 0);
    this.setCurrentPage(current || 1);
  }

  public getTotalUnits (): number {
    return this._totalUnits;
  }

  public setTotalUnits (total: number): void {
    this._totalUnits = total;
    // Need to recalc since page nums are changing
    this._recalculatePagination();
  }

  public getTotalPages (): number{
    return Math.ceil(this.getTotalUnits() / this.getUnitsPerPage());
  }

  public getUnitsPerPage (): number {
    return this._unitsPerPage;
  }

  public setUnitsPerPage (units: number): void {
    // Only recalc if units per page changes
    if (units != this._unitsPerPage) {
      this._unitsPerPage = units;
      this._recalculatePagination();
    }
  }

  public getCurrentPage (): number {
    return this._currentPage;
  }

  public setCurrentPage (pageNum: number): void {
    if (this._isValidPageNum(pageNum)) {
      this._currentPage = pageNum;
    }
  }
  
  public nextPage (): void {
    this.setCurrentPage(this._currentPage + 1);
  }

  public previousPage (): void {
    this.setCurrentPage(this._currentPage - 1);
  }

  public printDisplayingString (): string {
    const [min, max] =
      this._calculateDisplayedUnits(this._currentPage);

    return `${min} – ${max} of ${this.getTotalUnits()}`;
  }

  public printPerPageString (): string {
    return `${this.unit} per page`;
  }

  private _isValidPageNum (pageNum): boolean {
    if (pageNum < 1 || this._exceedsTotal(pageNum)) {
      return false;
    } else {
      return true;
    }
  }

  private _exceedsTotal (pageNum): boolean {
    const r = this._calculateRemainder(pageNum);

    return r > 0 && r > this.getUnitsPerPage();
  }

  private _calculateRemainder (pageNum): number {
    return (pageNum * this.getUnitsPerPage())
      - this.getTotalUnits();
  }

  private _calculateDisplayedUnits (currentPage): number[] {
    const maxUnit = this._calculateMaxUnits(currentPage);
    const minUnit = this._calculateMinUnits(currentPage);

    return [minUnit, maxUnit];
  }

  private _calculateMaxUnits (currentPage): number {
    const max = this.getUnitsPerPage() * currentPage;
    const total = this.getTotalUnits();

    return max > total ? total : max;
  }

  private _calculateMinUnits (currentPage): number {
    const units = this.getUnitsPerPage();
    const min = ((units * currentPage) - units) + 1;
    const max = this._calculateMaxUnits(currentPage);

    return min > max ? max : min;
  }

  private _recalculatePagination (): void {
    // Call when units per page or total units change
    this._currentPage = 1;
  }
}
