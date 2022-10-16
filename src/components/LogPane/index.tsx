import styled from "@emotion/styled";
import { ListProps } from "react-virtualized";
import { Virtuoso } from "react-virtuoso";
import AnsiiRow from "components/LogRow/AnsiiRow";
import CollapsedRow from "components/LogRow/CollapsedRow";
import ResmokeRow from "components/LogRow/ResmokeRow";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";

type LogPaneProps = Omit<
  ListProps,
  "height" | "width" | "itemData" | "rowHeight"
> & {
  wrap: boolean;
  initialScrollIndex: number;
  logType: LogTypes;
};

const LogPane: React.FC<LogPaneProps> = ({
  rowCount,
  wrap,
  logType,
  initialScrollIndex,
}) => {
  const { listRef, processedLogLines } = useLogContext();

  return (
    <StyledVirtuoso
      ref={listRef}
      defaultItemHeight={16}
      initialTopMostItemIndex={initialScrollIndex}
      // eslint-disable-next-line react/no-unstable-nested-components
      itemContent={(index) => {
        const Row = Array.isArray(processedLogLines[index])
          ? CollapsedRow
          : rowRendererMap[logType];
        return <Row index={index} wrap={wrap} />;
      }}
      totalCount={rowCount}
    />
  );
};

const StyledVirtuoso = styled(Virtuoso)`
  overflow: "scroll visible";
`;

const rowRendererMap = {
  [LogTypes.EVERGREEN_TASK_LOGS]: AnsiiRow,
  [LogTypes.EVERGREEN_TEST_LOGS]: AnsiiRow,
  [LogTypes.RESMOKE_LOGS]: ResmokeRow,
};

LogPane.displayName = "LogPane";

export default LogPane;
