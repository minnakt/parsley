import styled from "@emotion/styled";
import { Virtuoso } from "react-virtuoso";
import AnsiiRow from "components/LogRow/AnsiiRow";
import CollapsedRow from "components/LogRow/CollapsedRow";
import ResmokeRow from "components/LogRow/ResmokeRow";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { isCollapsedRow } from "utils/collapsedRow";

interface LogPaneProps {
  highlightRegex: RegExp;
  initialScrollIndex: number;
  logType: LogTypes;
  rowCount: number;
  wrap: boolean;
}

const LogPane: React.FC<LogPaneProps> = ({
  highlightRegex,
  initialScrollIndex,
  logType,
  rowCount,
  wrap,
}) => {
  const { listRef, processedLogLines } = useLogContext();

  return (
    <StyledVirtuoso
      ref={listRef}
      defaultItemHeight={16}
      initialTopMostItemIndex={initialScrollIndex}
      // eslint-disable-next-line react/no-unstable-nested-components
      itemContent={(index) => {
        const processedLogLine = processedLogLines[index];

        if (isCollapsedRow(processedLogLine)) {
          return <CollapsedRow collapsedLines={processedLogLine} />;
        }
        const Row = rowRendererMap[logType];
        return (
          <Row
            highlights={highlightRegex}
            index={index}
            lineNumber={processedLogLine}
            wrap={wrap}
          />
        );
      }}
      totalCount={rowCount}
    />
  );
};

const StyledVirtuoso = styled(Virtuoso)`
  overflow-x: "scroll";
`;

const rowRendererMap = {
  [LogTypes.EVERGREEN_TASK_LOGS]: AnsiiRow,
  [LogTypes.EVERGREEN_TEST_LOGS]: AnsiiRow,
  [LogTypes.RESMOKE_LOGS]: ResmokeRow,
};

LogPane.displayName = "LogPane";

export default LogPane;
