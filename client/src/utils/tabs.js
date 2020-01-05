
export const defaultTab = {
  name: 'All',
  value: 'all',
};

export const defaultTabValue = defaultTab.value;

const commonTabs = [
  {
    name: 'Compound',
    value: 'compound',
  },
  {
    name: 'Dharma',
    value: 'dharma',
  },
];

export const getTabs = () => {
  let tabs;
  if (USE_OWN_API) {
    tabs = [
      defaultTab,
      ...commonTabs,
    ];
  } else {
    tabs = [
      defaultTab,
      ...commonTabs,
      {
        name: 'Maker DAO',
        value: 'makerdao',
      },
    ];
  }
  return tabs;
};
