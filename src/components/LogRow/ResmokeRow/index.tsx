import BaseRow from "components/LogRow/BaseRow";
import { useLogContext } from "context/LogContext";
import { isLineInRange } from "../utils";

interface ResmokeRowProps {
  index: number;
  wrap: boolean;
  lineNumber: number;
  highlights: RegExp;
}

const ResmokeRow: React.FC<ResmokeRowProps> = ({
  index,
  wrap,
  lineNumber,
  highlights,
}) => {
  const {
    getLine,
    getResmokeLineColor,
    scrollToLine,
    highlightedLine,
    prettyPrint,
    range,
    searchState,
  } = useLogContext();

  const { searchTerm } = searchState;

  const lineContent = getLine(lineNumber);
  const lineColor = getResmokeLineColor(lineNumber);
  const inRange = isLineInRange(range, lineNumber);

  return lineContent ? (
    <BaseRow
      data-cy="resmoke-row"
      highlightedLine={highlightedLine}
      highlights={highlights}
      index={index}
      lineNumber={lineNumber}
      prettyPrint={prettyPrint}
      resmokeRowColor={lineColor}
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
