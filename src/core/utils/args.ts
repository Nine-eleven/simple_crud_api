export const parseArgs = () => {
  const args = process.argv.slice(2);

  const argsObj: { [key: string]: any } = {};

  args.find((arg) => {
    const [key, value] = arg.split('=');
    argsObj[key] = value;
  });

  return argsObj;
};
