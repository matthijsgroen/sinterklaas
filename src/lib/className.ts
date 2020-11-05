const className = (obj: Record<string, boolean>): string =>
  Object.entries(obj)
    .reduce<string[]>(
      (acc, [name, accept]) => (accept ? acc.concat(name) : acc),
      []
    )
    .join(" ");

export default className;
