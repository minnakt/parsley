import AnsiUp from "ansi_up";
import linkifyHtml from "linkify-html";
import BaseRow from "components/LogRow/BaseRow";

import { useLogContext } from "context/LogContext";
import { isLineInRange } from "../utils";

const ansiUp = new AnsiUp();

interface AnsiiRowProps {
  index: number;
  wrap: boolean;
  lineNumber: number;
  highlights: RegExp;
}

const AnsiiRow: React.FC<AnsiiRowProps> = ({
  index,
  wrap,
  lineNumber,
  highlights,
}) => {
  const { getLine, scrollToLine, highlightedLine, range, searchState } =
    useLogContext();

  const { searchTerm } = searchState;

  const lineContent = getLine(lineNumber) || "";
  const linkifiedLine = linkifyHtml(ansiUp.ansi_to_html(lineContent), {
    validate: {
      url: (value: string) => /^(http)s?:\/\//.test(value),
    },
  });
  const inRange = isLineInRange(range, lineNumber);

  return lineContent ? (
    <BaseRow
      data-cy="ansii-row"
      highlightedLine={highlightedLine}
      highlights={highlights}
      index={index}
      lineNumber={lineNumber}
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
