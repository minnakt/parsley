enum QueryParams {
  Search = "search",
  Highlights = "highlights",
  Bookmarks = "bookmarks",
  Filters = "filters",
  SelectedLine = "selectedLine",
  Wrap = "wrap",
  Expandable = "expandable",
  CaseSensitive = "caseSensitive",
  FilterLogic = "filterLogic",
  LowerRange = "lower",
  UpperRange = "upper",
}

enum FilterLogic {
  And = "and",
  Or = "or",
}

export { FilterLogic, QueryParams };
