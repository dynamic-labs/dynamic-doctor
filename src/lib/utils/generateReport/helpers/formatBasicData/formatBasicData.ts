export type FormattedData = {
  name: string;
  title: string;
  value: string;
};

type Value = {
  name: string;
  version: string;
};

export const formatBasicData = (
  data: Record<string, Value>,
): FormattedData[] => {
  const formattedData: FormattedData[] = [];

  Object.entries(data).forEach(([key, value]) => {
    formattedData.push({
      name: value.name,
      title: key,
      value: value.version,
    });
  });

  return formattedData;
};
