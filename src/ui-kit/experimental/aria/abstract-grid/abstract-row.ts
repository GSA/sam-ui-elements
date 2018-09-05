import { AbstractCell, CellRole } from './abstract-cell';

export class AbstractRow {

  public node;

  public cells: AbstractCell[] = [];
  public rowheaders: AbstractCell[] = [];
  public columnheaders: AbstractCell[] = [];

  constructor (node: Element) {
    this.node = node;
    this._findCells(node);
  }

  public addCell (cell: AbstractCell) {
    this.cells.push(cell);
  }

  private _findCells (node: Element) {
    const roles: CellRole[] = [
      'gridcell', 'rowheader', 'columnheader'
    ];

    this.cells = roles.reduce(
      (accumulator: AbstractCell[], role: CellRole) => {
        const cells = this._getCellsByRole(node, role);

        this._setRowHeaders(cells, role);

        return accumulator
          .concat(
            this._getCellsByRole(node, role)
          );
      }, []
    );
  }

  private _getCellsByRole (row: Element, role: CellRole)
    : AbstractCell[] {

    const queryString = `[role="${role}"]`;
    const cellArray: AbstractCell[] = [];
    const cells = row.querySelectorAll(queryString);

    for (let i = 0; i < cells.length; i++) {
      const cellObj = new AbstractCell(cells[i], role);
      cellArray.push(cellObj);
    }

    return cellArray;
  }

  private _setRowHeaders (
    cells: AbstractCell[], role: CellRole): void {

    if (role === 'rowheader') {
      this.rowheaders.concat(cells);
    } else if (role === 'columnheader') {
      this.columnheaders.concat(cells);
    } else {
      return;
    }

  }

}
