// @import_dependencies
import moment from "moment";

// @import_services

// @import_models
import { Program } from "@app/models";

// @import_utilities
import { responseUtility } from "@core/utilities/responseUtility";

// @import_types

class ProgramService {
  constructor() {}

  public async upsert(_params) {
    try {
      if (_params._id) {
        const exists = await Program.findOne({ _id: _params._id }).lean();
        if (!exists) return responseUtility.error("program.not_found");

        const program = await Program.findOneAndUpdate(
          { _id: _params._id },
          { $set: _params },
          { new: true, lean: true }
        );

        return responseUtility.success({ object: program });
      } else {
        const create = await Program.create(_params);
        const program = create.toObject();

        return responseUtility.success({ object: program });
      }
    } catch (error) {
      console.log("error", error);
      return responseUtility.error("internal_error", error);
    }
  }

  public async list(_params) {
    try {
      const programs = await Program.find({}).sort({ created_at: -1 }).lean();

      return responseUtility.success({ list: programs });
    } catch (error) {
      console.log("error", error);
      return responseUtility.error("internal_error", error);
    }
  }

  public async get(_params) {
    try {
      const program = await Program.findOne({ _id: _params._id }).lean();
      if (!program) return responseUtility.error("program.not_found");

      return responseUtility.success({ object: program });
    } catch (error) {
      console.log("error", error);
      return responseUtility.error("internal_error", error);
    }
  }
}

export const programService = new ProgramService();
export { ProgramService };
