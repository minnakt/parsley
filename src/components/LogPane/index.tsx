import { useEffect } from "react";
import { AutoSizer, List, ListProps, ListRowRenderer } from "react-virtualized";
import { useLogContext } from "context/LogContext";
import { ExpandedLines } from "types/logs";

type LogPaneProps = Omit<
  ListProps,
  "height" | "width" | "itemData" | "rowHeight"
> & {
  wrap: boolean;
  filterLogic: string;
  filters: string[];
  initialScrollIndex: number;
  rowRenderer: ListRowRenderer;
  expandedLines: ExpandedLines;
};

const LogPane: React.FC<LogPaneProps> = ({
  rowRenderer,
  rowCount,
  cache,
  wrap,
  filterLogic,
  filters,
  expandedLines,
  initialScrollIndex,
  ...rest
}) => {
  const { listRef } = useLogContext();

  useEffect(() => {
    // Reset the cache and recalculate the row heights
    cache.clearAll();
    listRef.current?.recomputeRowHeights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrap, filterLogic, `${filters}`, `${expandedLines}`]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          ref={listRef}
          containerStyle={{ overflow: "scroll visible" }}
          deferredMeasurementCache={cache}
          height={height}
          overscanRowCount={200}
          rowCount={rowCount}
          rowHeight={cache.rowHeight}
          rowRenderer={rowRenderer}
          scrollToAlignment="start"
          scrollToIndex={initialScrollIndex}
          width={width}
          {...rest}
        />
      )}
    </AutoSizer>
  );
};

LogPane.displayName = "LogPane";

export default LogPane;
