import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";

const healthCheck = asyncHandler((req, res) => {
  res.status(200).json(new ApiResponse(200, "Ok, healthCheck passed"));
});

export { healthCheck };
