import { useState } from 'react';

const useSetting = <T extends boolean | string>(
  id: string,
  defaultValue?: T
): [T | undefined, (value: T) => void] => {
  const [value, setValue] = useState<T | undefined>(defaultValue);

  // const { data } = useGetSettingQuery({ variables: { id } });

  // useEffect(() => {
  //   if (!data?.setting) return;
  //   switch (data.setting.__typename) {
  //     case 'BooleanSetting':
  //       setValue(data.setting.valueAsBoolean as T);
  //       break;
  //     case 'StringSetting':
  //       setValue(data.setting.valueAsString as T);
  //       break;
  //   }
  // }, [data]);

  // const [doUpdate] = useUpdateSettingMutation();

  // const updateValue = (newValue: T) => {
  //   const value = {} as SettingValue;
  //   if (newValue === true || newValue === false) {
  //     value.boolean = newValue;
  //   } else {
  //     value.string = newValue;
  //   }
  //   doUpdate({ variables: { id, value } });
  //   setValue(newValue);
  // };

  const updateValue = (newValue: T) => {};

  return [value as T, updateValue];
};

export default useSetting;
