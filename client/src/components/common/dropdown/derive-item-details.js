import fromPairs from 'lodash.frompairs';
import invariant from 'invariant';

export const deriveItemDetails = (options) => {
  const {
    selected = [],
    disabled = [],
    itemKey, items,
    onSelectChange,
  } = options;
  const [disabledMap, selectionMap] = [disabled, selected].map(list => fromPairs(list.map(k => [k, true])));
  return items.map((item) => {
    const key = itemKey(item);
    const itemSelected = Boolean(selectionMap[key]);
    const itemDisabled = Boolean(disabledMap[key]);
    const finalSelected = !itemDisabled && itemSelected;

    invariant(key || key === 0, 'Item key in simple-drop-down is found falsy');
    invariant(
      !(itemDisabled && itemSelected),
      'A DropDown item should not be both selected or disabled',
    );
    const payload = {
      item,
      itemDisabled,
      itemSelected: finalSelected,
      key,
    };
    return {
      ...payload,
      onSelectChange: () => { onSelectChange(payload); },
    };
  });
};
