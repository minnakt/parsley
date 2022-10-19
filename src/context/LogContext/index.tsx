import {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { VirtuosoHandle } from "react-virtuoso";
import { FilterLogic, LogTypes } from "constants/enums";
import { QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import { ExpandedLines, ProcessedLogLines } from "types/logs";
import { filterLogs } from "utils/filter";
import searchLogs from "utils/searchLogs";
import useLogState from "./state";
import { DIRECTION, SearchState } from "./types";
import { getNextPage } from "./utils";

interface LogContextState {
  expandedLines: ExpandedLines;
  fileName?: string;
  hasLogs: boolean;
  highlightedLine?: number;
  lineCount: number;
  listRef: React.RefObject<VirtuosoHandle>;
  processedLogLines: ProcessedLogLines;
  range: {
    lowerRange: number;
    upperRange?: number;
  };
  searchState: SearchState;

  clearLogs: () => void;
  collapseLines: (idx: number) => void;
  expandLines: (expandedLines: ExpandedLines) => void;
  getLine: (lineNumber: number) => string | undefined;
  ingestLines: (logs: string[], logType: LogTypes) => void;
  paginate: (dir: DIRECTION) => void;
  scrollToLine: (lineNumber: number) => void;
  setCaseSensitive: (caseSensitive: boolean) => void;
  setFileName: (fileName: string) => void;
  setSearch: (search: string) => void;
}

const LogContext = createContext<LogContextState | null>(null);

const useLogContext = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error("useLogContext must be used within a LogContextProvider");
  }
  return context as LogContextState;
};

interface LogContextProviderProps {
  children: React.ReactNode;
  initialLogLines?: string[];
}

const LogContextProvider: React.FC<LogContextProviderProps> = ({
  children,
  initialLogLines,
}) => {
  const [filters] = useQueryParam<string[]>(QueryParams.Filters, []);
  const [bookmarks] = useQueryParam<number[]>(QueryParams.Bookmarks, []);
  const [selectedLine] = useQueryParam<number | undefined>(
    QueryParams.SelectedLine,
    undefined
  );
  const [filterLogic] = useQueryParam(QueryParams.FilterLogic, FilterLogic.And);
  const [upperRange] = useQueryParam<undefined | number>(
    QueryParams.UpperRange,
    undefined
  );
  const [lowerRange] = useQueryParam(QueryParams.LowerRange, 0);
  const [expandableRows] = useQueryParam(QueryParams.Expandable, false);
  const { state, dispatch } = useLogState(initialLogLines);
  const listRef = useRef<VirtuosoHandle>(null);

  const getLine = useCallback(
    (lineNumber: number) => state.logs[lineNumber],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.logs.length]
  );

  const [processedLogLines, setProcessedLogLines] = useState<ProcessedLogLines>(
    []
  );
  const deferredFilters = useDeferredValue(filters);
  const deferredBookmarks = useDeferredValue(bookmarks);
  const deferredSelectedLine = useDeferredValue(selectedLine);
  const deferredFilterLogic = useDeferredValue(filterLogic);
  const deferredExpandedLines = useDeferredValue(state.expandedLines);
  const deferredExpandableRows = useDeferredValue(expandableRows);

  useEffect(() => {
    setProcessedLogLines(
      filterLogs({
        logLines: state.logs,
        filters: deferredFilters,
        bookmarks: deferredBookmarks,
        selectedLine: deferredSelectedLine,
        filterLogic: deferredFilterLogic,
        expandedLines: deferredExpandedLines,
        expandableRows: deferredExpandableRows,
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.logs.length,
    `${deferredFilters}`,
    `${deferredBookmarks}`,
    deferredSelectedLine,
    deferredFilterLogic,
    `${deferredExpandedLines}`,
    deferredExpandableRows,
  ]);

  const searchResults = useMemo(() => {
    const results = state.searchState.searchTerm
      ? searchLogs({
          searchRegex: state.searchState.searchTerm,
          processedLogLines,
          upperBound: upperRange,
          lowerBound: lowerRange,
          getLine,
        })
      : [];
    dispatch({
      type: "SET_MATCH_COUNT",
      matchCount: results.length,
    });
    return results;
  }, [
    dispatch,
    getLine,
    state.searchState.searchTerm,
    lowerRange,
    upperRange,
    processedLogLines,
  ]);

  const highlightedLine =
    state.searchState.searchIndex !== undefined
      ? searchResults[state.searchState.searchIndex]
      : undefined;

  const memoizedContext = useMemo(
    () => ({
      expandedLines: state.expandedLines,
      fileName: state.fileName,
      hasLogs: !!state.logs.length,
      hasSearch: !!state.searchState.searchTerm,
      highlightedLine,
      lineCount: state.logs.length,
      listRef,
      processedLogLines,
      range: {
        lowerRange,
        upperRange,
      },
      searchState: state.searchState,

      clearLogs: () => dispatch({ type: "CLEAR_LOGS" }),
      collapseLines: (idx: number) => dispatch({ type: "COLLAPSE_LINES", idx }),
      expandLines: (expandedLines: ExpandedLines) =>
        dispatch({ type: "EXPAND_LINES", expandedLines }),
      getLine,
      ingestLines: (lines: string[], logType: LogTypes) => {
        dispatch({ type: "INGEST_LOGS", logs: lines, logType });
      },
      paginate: (direction: DIRECTION) => {
        const { searchIndex, searchRange } = state.searchState;
        if (searchIndex !== undefined && searchRange !== undefined) {
          const nextPage = getNextPage(searchIndex, searchRange, direction);
          dispatch({ type: "PAGINATE", nextPage });
          listRef.current?.scrollToIndex(searchResults[nextPage]);
        }
      },
      scrollToLine: (lineNumber: number) =>
        listRef.current?.scrollToIndex(lineNumber),
      setCaseSensitive: (caseSensitive: boolean) => {
        dispatch({ type: "SET_CASE_SENSITIVE", caseSensitive });
      },
      setFileName: (fileName: string) => {
        dispatch({ type: "SET_FILE_NAME", fileName });
      },
      setSearch: (searchTerm: string) => {
        dispatch({ type: "SET_SEARCH_TERM", searchTerm });
      },
    }),
    [
      state.expandedLines,
      state.fileName,
      state.logs.length,
      state.searchState,
      highlightedLine,
      lowerRange,
      processedLogLines,
      searchResults,
      upperRange,
      dispatch,
      getLine,
    ]
  );

  return (
    <LogContext.Provider value={memoizedContext}>
      {children}
    </LogContext.Provider>
  );
};

export { LogContextProvider, useLogContext };
