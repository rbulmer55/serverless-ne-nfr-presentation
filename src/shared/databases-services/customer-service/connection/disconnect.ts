import {disconnect as mongooseDisconnect} from 'mongoose';

export async function disconnect() {
  return mongooseDisconnect();
}
