import { IncomingMessage } from 'http';

export const getRequestData = async (req: IncomingMessage) => {
  const buffers = [] as any;
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  return Buffer.concat(buffers).toString();
};
