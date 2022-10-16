import AnsiUp from "ansi_up";
import linkifyHtml from "linkify-html";
import BaseRow from "components/LogRow/BaseRow";
import { useLogContext } from "context/LogContext";
import { isLineInRange } from "../utils";

const ansiUp = new AnsiUp();

interface AnsiiRowProps {
  index: number;
  wrap: boolean;
}

const AnsiiRow: React.FC<AnsiiRowProps> = ({ index, wrap }) => {
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
  const lineContent = getLine(line) || "";
  const linkifiedLine = linkifyHtml(ansiUp.ansi_to_html(lineContent), {
    validate: {
      url: (value: string) => /^(http)s?:\/\//.test(value),
    },
  });

  const inRange = isLineInRange(range, line);
  return lineContent ? (
    <BaseRow
      data-cy-text="ansii-row"
      highlightedLine={highlightedLine}
      index={index}
      lineNumber={line}
      scrollToLine={scrollToLine}
      searchTerm={inRange ? searchTerm : undefined}
      wrap={wrap}
    >
      {linkifiedLine}
    </BaseRow>
  ) : null;
};

AnsiiRow.displayName = "AnsiiRow";

export default AnsiiRow;
