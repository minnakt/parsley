import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import DetailsOverlay from "components/DetailsOverlay";
import Icon from "components/Icon";
import PopoverButton from "components/PopoverButton";
import SearchBar from "components/SearchBar";
import { StyledLink } from "components/styles";
import { QueryParams } from "constants/queryParams";
import { navbarHeight, size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";
import { validateRegexp } from "utils/validators";
import UploadLink from "./UploadLink";

const { gray, white } = palette;

const NavBar: React.FC = () => {
  const [, setSearch] = useQueryParam(QueryParams.Search, "");
  const [filters, setFilters] = useQueryParam<string[]>(
    QueryParams.Filters,
    []
  );
  const { hasLogs, clearLogs } = useLogContext();

  const handleSearch = (selected: string, value: string) => {
    if (selected === "search") {
      setSearch(value);
    } else if (selected === "filter" && !filters.includes(value)) {
      setFilters([...filters, value]);
    }
  };

  return (
    <Container>
      <FlexContainer>
        <LinkContainer>
          <Icon glyph="LobsterLogo" />
          <StyledLink href="https://wiki.corp.mongodb.com">Wiki</StyledLink>
          <UploadLink clearLogs={clearLogs} hasLogs={hasLogs} />
        </LinkContainer>
        <StyledSearchBar
          onSubmit={handleSearch}
          validator={validateRegexp}
          validatorMessage="Invalid Regular Expression"
        />
      </FlexContainer>

      <StyledButton buttonText="Details" data-cy="details-button">
        <DetailsOverlay />
      </StyledButton>
    </Container>
  );
};

const Container = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${navbarHeight};

  background-color: ${white};
  border-bottom: 1px solid ${gray.light2};
  padding: 0 ${size.s};
`;

const FlexContainer = styled.div`
  display: flex;
`;

const LinkContainer = styled.div`
  display: flex;
  margin-right: ${size.l};
  gap: ${size.l};
`;

const StyledSearchBar = styled(SearchBar)`
  width: 60vw;
  margin-left: ${size.m};
`;

const StyledButton = styled(PopoverButton)`
  margin: 0 ${size.xs};
`;

export default NavBar;
