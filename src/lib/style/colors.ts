export const rgba = (hexColor: string, opacity: number) => {
  const rgb: number[] =
    hexColor.length === 4
      ? [
          parseInt(hexColor.slice(1, 2).repeat(2), 16),
          parseInt(hexColor.slice(2, 3).repeat(2), 16),
          parseInt(hexColor.slice(3, 4).repeat(2), 16),
        ]
      : [
          parseInt(hexColor.slice(1, 3), 16),
          parseInt(hexColor.slice(3, 5), 16),
          parseInt(hexColor.slice(5, 7), 16),
        ];

  return `rgba(${rgb.join(",")}, ${opacity})`;
};
