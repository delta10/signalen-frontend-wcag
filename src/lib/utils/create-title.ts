export const createTitle = (
  args: (string | undefined)[],
  titleSeparator = ' · '
): string => {
  return args.filter((value) => value).join(titleSeparator)
}
