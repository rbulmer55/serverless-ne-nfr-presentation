import mongoose from 'mongoose';

export function getEntity(
  model: typeof mongoose.Model,
  query?: object,
  projection?: object,
  options?: object
): Promise<any> {
  return model.findOne(query, projection, options);
}
