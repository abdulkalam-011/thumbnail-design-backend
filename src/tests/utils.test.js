
import { ApiResponse } from "../utils/Response.js";

test("data type check for cloudiniry localPath ", () => {
  let name = "jain";

  expect(
    new ApiResponse(200, `test is done by ${name}`, "test succesfull")
  ).toEqual({
    statusCode: 200,
    data: "test is done by jain",
    message: "test succesfull",
    success: true,
  });
});
