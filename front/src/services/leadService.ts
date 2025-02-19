import { get, post } from "../util/http";
const api = "/lead";
export const leadService = {
  api,
  get: async ({ _id }: { _id: string }) => {
    return await get({ api: `${api}/get/${_id}` });
  },
  upsert: async (leadData: any) => {
    return await post({
      api: `${api}/upsert`,
      options: { data: { leadData } },
    });
  },
};
