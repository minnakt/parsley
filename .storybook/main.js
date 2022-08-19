module.exports = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
    // React 18 causes some issues with storyshots. In package.json we have a resolutions field for
    // react-test-renderer to get around this. (https://github.com/storybookjs/storybook/issues/17985)
    "@storybook/addon-storyshots",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    // storyStoreV7 is enabled by default and works well for our general Storybook configuration.
    // However, we have to disable it because it breaks storyshots. Storybook developers are working
    // on a new replacement addon for storyshots to fix this in the future.
    // (https://github.com/storybookjs/storybook/issues/15916)
    storyStoreV7: false,
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
    },
  },
  async viteFinal(config, { configType }) {
    const resolve = {
      alias: {
        "@leafygreen-ui/emotion": "./config/leafygreen-ui/emotion.ts",
      },
    };

    if (configType === "PRODUCTION") {
      // We need to override the 'base' property so that the path to storybook-static/assets
      // is correct. (https://github.com/storybookjs/builder-vite/issues/475)
      return { ...config, resolve, base: "./" };
    }
    return { ...config, resolve };
  },
};
