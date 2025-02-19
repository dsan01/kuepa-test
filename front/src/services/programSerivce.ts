import { get } from "../util/http";
const api = "/program";
export const programService = {
  api,
  get: async () => {
    return await get({ api: `${api}/` });
  },
};
