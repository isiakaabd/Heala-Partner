import { Login_USER } from "components/graphQL/Mutation";

export const mockLogin = [
  {
    request: {
      query: Login_USER,
      variables: {
        data: {
          email: "shally@gmail.com",
          password: "admin1234",
          authType: "normal",
        },
      },
    },
    result: {
      data: {
        login: {
          account: {
            _id: "628b4de7161f3d0013b7e195",
            dociId: "HEALA-HL9GALYS",
            email: "shally@gmail.com",
            isEmailVerified: "false",
            access_token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoic2hhbGx5QGdtYWlsLmNvbSIsImlhdCI6MTY1ODczNjI3OCwiZXhwIjoxNjU4ODIyNjc4LCJhdWQiOiJhdXRoIiwiaXNzIjoiaGVhbGEiLCJzdWIiOiI2MjhiNGRlNzE2MWYzZDAwMTNiN2UxOTUifQ.gSZd68tNKja7fr0tQLzKLztgrGkT1gQ9ZAUvkRtZOe0",
            refresh_token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoic2hhbGx5QGdtYWlsLmNvbSIsImlhdCI6MTY1ODczNjI3OCwiZXhwIjoxNjU4OTA5MDc4LCJhdWQiOiJhdXRoIiwiaXNzIjoiaGVhbGEiLCJzdWIiOiI2MjhiNGRlNzE2MWYzZDAwMTNiN2UxOTUifQ.pxpjNNSxOunn5PXsBtqAOFid1wJuwoHHgmE24U5wwgU",
            nextStep: null,
            deactivated: "false",
            deactivatedAt: null,
            deactivateType: null,
            isPasswordTemporary: "false",
          },
          errors: null,
        },
      },
    },
  },
];
