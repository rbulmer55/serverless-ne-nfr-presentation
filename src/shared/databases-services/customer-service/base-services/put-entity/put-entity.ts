import mongoose from 'mongoose';

export async function putEntity(
  model: typeof mongoose.Model,
  props: object,
  id: string,
  options?: object
): Promise<any> {
  return model.updateOne(
    {_id: id},
    {
      ...props,
    },
    {...options}
  );
}
