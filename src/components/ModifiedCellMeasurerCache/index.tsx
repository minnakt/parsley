// @ts-nocheck
/* eslint-disable no-underscore-dangle */

import { CellMeasurerCache } from "react-virtualized";

class ModifiedCellMeasurerCache extends CellMeasurerCache {
  // References:
  // https://github.com/bvaughn/react-virtualized/issues/842
  // https://github.com/bvaughn/react-virtualized/blob/e360d958b99fa965fd3f1caed4506403ad652cd3/source/CellMeasurer/CellMeasurerCache.js#L99
  clearAfter(rowIndex: number, columnIndex: number = 0) {
    const rows = Object.keys(this._cellHeightCache);
    const key = this._keyMapper(rowIndex, columnIndex);
    const startIndex = rows.indexOf(key);

    // Slice the entries from the cache that should remain unchanged.
    const entries = Object.entries(this._cellHeightCache);
    const firstNEntries = entries.slice(0, startIndex);
    const newCellHeightCache = Object.fromEntries(firstNEntries);

    this._cellHeightCache = newCellHeightCache;

    this._updateCachedColumnAndRowSizes(startIndex, columnIndex);
  }
}

export default ModifiedCellMeasurerCache;
