import BaseRow from "components/LogRow/BaseRow";
import { useLogContext } from "context/LogContext";
import { isLineInRange } from "../utils";

interface ResmokeRowProps {
  index: number;
  wrap: boolean;
}

const ResmokeRow: React.FC<ResmokeRowProps> = ({ index, wrap }) => {
  const {
    getLine,
    processedLogLines,
    searchState,
    range,
    highlightedLine,
    scrollToLine,
  } = useLogContext();

  const { searchTerm } = searchState;

  const line = processedLogLines[index] as number;
  const lineContent = getLine(line);
  const inRange = isLineInRange(range, line);

  return lineContent ? (
    <BaseRow
      data-cy-text="resmoke-row"
      highlightedLine={highlightedLine}
      index={index}
      lineNumber={line}
      scrollToLine={scrollToLine}
      searchTerm={inRange ? searchTerm : undefined}
      wrap={wrap}
    >
      {lineContent}
    </BaseRow>
  ) : null;
};

ResmokeRow.displayName = "ResmokeRow";

export default ResmokeRow;
