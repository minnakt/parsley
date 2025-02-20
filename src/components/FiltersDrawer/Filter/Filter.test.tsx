import { render, screen, userEvent } from "test_utils";
import Filter from ".";

describe("filters", () => {
  const user = userEvent.setup();

  it("should display the name of the filter", () => {
    render(
      <Filter
        deleteFilter={jest.fn()}
        editFilter={jest.fn()}
        filterName="myFilter"
      />
    );
    expect(screen.getByText("myFilter")).toBeInTheDocument();
  });

  it("should be able to toggle editing", async () => {
    render(
      <Filter
        deleteFilter={jest.fn()}
        editFilter={jest.fn()}
        filterName="myFilter"
      />
    );
    // Should show text input containing the current value.
    await user.click(screen.getByLabelText("Edit filter"));
    expect(screen.queryByText("myFilter")).toBeNull();
    expect(screen.getByDataCy("edit-filter-name")).toBeInTheDocument();
    expect(screen.getByDataCy("edit-filter-name")).toHaveValue("myFilter");

    const confirmButton = screen.getByRole("button", {
      name: "OK",
    });
    const cancelButton = screen.getByRole("button", {
      name: "Cancel",
    });
    expect(confirmButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it("should call editFilter with the correct parameters", async () => {
    const editFilter = jest.fn();
    render(
      <Filter
        deleteFilter={jest.fn()}
        editFilter={editFilter}
        filterName="myFilter"
      />
    );
    // Clear the text input and submit a new filter.
    await user.click(screen.getByLabelText("Edit filter"));
    await user.clear(screen.getByDataCy("edit-filter-name"));
    await user.type(screen.getByDataCy("edit-filter-name"), "newFilter");

    const confirmButton = screen.getByRole("button", {
      name: "OK",
    });
    await user.click(confirmButton);

    expect(editFilter).toHaveBeenCalledTimes(1);
    expect(editFilter).toHaveBeenCalledWith("myFilter", "newFilter");
  });

  it("should toggle between visibility icons when they are clicked", async () => {
    render(
      <Filter
        deleteFilter={jest.fn()}
        editFilter={jest.fn()}
        filterName="myFilter"
      />
    );
    expect(screen.getByLabelText("Visibility Icon")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Hide filter"));
    expect(screen.getByLabelText("Closed Eye Icon")).toBeInTheDocument();
  });

  it("should call deleteFilter with the correct parameters", async () => {
    const deleteFilter = jest.fn();
    render(
      <Filter
        deleteFilter={deleteFilter}
        editFilter={jest.fn()}
        filterName="myFilter"
      />
    );
    await user.click(screen.getByLabelText("Delete filter"));
    expect(deleteFilter).toHaveBeenCalledTimes(1);
    expect(deleteFilter).toHaveBeenCalledWith("myFilter");
  });

  it("should be able to interact with Case Sensitivity segmented control", async () => {
    render(
      <Filter
        deleteFilter={jest.fn()}
        editFilter={jest.fn()}
        filterName="myFilter"
      />
    );

    const insensitiveOption = screen.getByRole("tab", {
      name: "Insensitive",
    });
    const sensitiveOption = screen.getByRole("tab", {
      name: "Sensitive",
    });

    expect(insensitiveOption).toHaveAttribute("aria-selected", "true");
    expect(sensitiveOption).toHaveAttribute("aria-selected", "false");

    await user.click(sensitiveOption);

    expect(insensitiveOption).toHaveAttribute("aria-selected", "false");
    expect(sensitiveOption).toHaveAttribute("aria-selected", "true");
  });

  it("should be able to interact with Match Type segmented control", async () => {
    render(
      <Filter
        deleteFilter={jest.fn()}
        editFilter={jest.fn()}
        filterName="myFilter"
      />
    );

    const exactOption = screen.getByRole("tab", {
      name: "Exact",
    });
    const inverseOption = screen.getByRole("tab", {
      name: "Inverse",
    });

    expect(exactOption).toHaveAttribute("aria-selected", "true");
    expect(inverseOption).toHaveAttribute("aria-selected", "false");

    await user.click(inverseOption);

    expect(exactOption).toHaveAttribute("aria-selected", "false");
    expect(inverseOption).toHaveAttribute("aria-selected", "true");
  });
});
