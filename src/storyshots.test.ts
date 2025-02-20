import initStoryshots, {
  snapshotWithOptions,
} from "@storybook/addon-storyshots";

// Recent updates to LG components cause a breaking change for storyshots because of the introduction of
// createUniqueClassName, a function that generates unique classnames at run time. We need to mock out the
// function so that our snapshots don't break. (https://jira.mongodb.org/browse/PD-2179)
jest.mock("@leafygreen-ui/lib", () => ({
  ...jest.requireActual("@leafygreen-ui/lib"),
  createUniqueClassName: jest.fn().mockReturnValue("static-lg-ui-classname"),
}));

describe("storyshots", () => {
  // eslint-disable-next-line jest/require-hook
  initStoryshots({
    test: ({ story, context, renderTree, stories2snapsConverter }) => {
      const snapshotFileName =
        stories2snapsConverter.getSnapshotFileName(context);
      return snapshotWithOptions({})({
        story,
        context,
        renderTree,
        snapshotFileName: snapshotFileName.replace("src", "."),
      });
    },
  });
});
