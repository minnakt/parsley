import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Toggle from "@leafygreen-ui/toggle";
import { Disclaimer } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { DetailName, DetailRow } from "../../styles";

const { gray } = palette;

interface BaseToggleProps {
  ["data-cy"]?: string;
  leftLabel?: string;
  rightLabel?: string;
  label: string;
  value: boolean;
  onChange: (checked: boolean) => void;
}

const BaseToggle: React.FC<BaseToggleProps> = ({
  "data-cy": dataCy,
  rightLabel = "ON",
  leftLabel = "OFF",
  label,
  value,
  onChange,
}) => (
  <DetailRow>
    <DetailName>{label}</DetailName>
    <ToggleWrapper>
      <ToggleLabel>{leftLabel}</ToggleLabel>
      <Toggle
        aria-labelledby={`${label} Toggle`}
        checked={value}
        data-cy={dataCy}
        onChange={onChange}
        size="small"
      />
      <ToggleLabel>{rightLabel}</ToggleLabel>
    </ToggleWrapper>
  </DetailRow>
);

const ToggleLabel = styled(Disclaimer)`
  color: ${gray.base};
  margin: 0 ${size.xxs};
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default BaseToggle;
