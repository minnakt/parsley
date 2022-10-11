import { ListRowProps } from "react-virtualized";
import { LogTypes } from "constants/enums";
import { ExpandedLines, ProcessedLogLines } from "types/logs";

interface BaseRowProps {
  listRowProps: ListRowProps;
  data: RowData;
}

interface RowData {
  getLine: (index: number) => string | undefined;
  scrollToLine: (lineNumber: number) => void;
  wrap: boolean;
  processedLines: ProcessedLogLines;
  logType: LogTypes;
  setExpandedLines: (expandedLines: ExpandedLines) => void;
  expandedLines: ExpandedLines;
  searchTerm?: RegExp;
  range: {
    lowerRange: number;
    upperRange?: number;
  };
  highlightedLine?: number;
}

export type { BaseRowProps, RowData };
