import { Login_USER } from "components/graphQL/Mutation";
import { getPatients, getProviders } from "components/graphQL/useQuery";

export const mockLogin = [
  {
    request: {
      query: Login_USER,
      variables: {
        data: {
          email: "shally@gmail.com",
          password: "1234",
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
            access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1ctZOe0",
            refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
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

export const mockPatients = [
  {
    request: {
      query: getPatients,
      variables: {
        first: 10,
        providerId: null,
      },
    },
    result: {
      data: {
        data: {
          profiles: {
            data: [
              {
                _id: "62e14eb149003e0013e02895",
                firstName: "Damilare",
                lastName: "Heala",
                height: null,
                weight: null,
                bloodGroup: null,
                dociId: "HEALA-EBDASEHA",
                genotype: null,
                gender: "Male",
                phoneNumber: "08109605535",
                provider: "Paelon Memorial Hospital",
                plan: "Basic",
                status: "Active",
                consultations: 0,
                createdAt:
                  "Wed Jul 27 2022 14:41:53 GMT+0000 (Coordinated Universal Time)",
                image: null,
                __typename: "Profile",
              },
            ],
            pageInfo: {
              totalDocs: 6,
              limit: 10,
              offset: null,
              hasPrevPage: false,
              hasNextPage: false,
              page: 1,
              totalPages: 1,
              pagingCounter: 1,
              prevPage: null,
              nextPage: null,
              __typename: "PageInfo",
            },
            __typename: "ProfileConnection",
          },
        },
      },
    },
  },
];

export const mockProviders = [
  {
    request: {
      query: getProviders,
      variables: {
        first: 10,
        providerId: null,
      },
    },
    result: {
      data: {
        profiles: {
          data: [
            {
              _id: "62e14eb149003e0013e02895",
              firstName: "Damilare",
              lastName: "Heala",
              height: null,
              weight: null,
              bloodGroup: null,
              dociId: "HEALA-EBDASEHA",
              genotype: null,
              gender: "Male",
              phoneNumber: "08109605535",
              provider: "Paelon Memorial Hospital",
              plan: "Basic",
              status: "Active",
              consultations: 0,
              createdAt:
                "Wed Jul 27 2022 14:41:53 GMT+0000 (Coordinated Universal Time)",
              image: null,
              __typename: "Profile",
            },
            {
              _id: "62b40ebd2d6da400139333a9",
              firstName: "Ifeoma",
              lastName: "Oriahi",
              height: 165,
              weight: 200,
              bloodGroup: "O",
              dociId: "HEALA-0IWJJA7O",
              genotype: "AA",
              gender: "Male",
              phoneNumber: "08065230812",
              provider: "Paelon Memorial Hospital",
              plan: "Basic",
              status: "Active",
              consultations: 4,
              createdAt:
                "Thu Jun 23 2022 06:57:01 GMT+0000 (Coordinated Universal Time)",
              image:
                "https://dq1z5gvyi71s7.cloudfront.net/2022-01-17-15-29-246054.png",
              __typename: "Profile",
            },
          ],
          pageInfo: {
            totalDocs: 6,
            limit: 10,
            offset: null,
            hasPrevPage: false,
            hasNextPage: false,
            page: 1,
            totalPages: 1,
            pagingCounter: 1,
            prevPage: null,
            nextPage: null,
            __typename: "PageInfo",
          },
          __typename: "ProfileConnection",
        },
      },
    },
  },
];

export const mock = {
  request: {
    query: Login_USER,
    variables: {
      data: {
        email: "shally@gmail.com",
        password: "1234",
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
};
export const patientsMock = [
  {
    request: {
      query: getPatients,
      variables: {
        first: 10,
        providerId: null,
      },
    },
    result: {
      data: {
        profiles: {
          data: [
            {
              _id: "62e14eb149003e0013e02895",
              firstName: "Damilare",
              lastName: "Heala",
              height: null,
              weight: null,
              bloodGroup: null,
              dociId: "HEALA-EBDASEHA",
              genotype: null,
              gender: "Male",
              phoneNumber: "08109605535",
              provider: "Paelon Memorial Hospital",
              plan: "Basic",
              status: "Active",
              consultations: 0,
              createdAt:
                "Wed Jul 27 2022 14:41:53 GMT+0000 (Coordinated Universal Time)",
              image: null,
              __typename: "Profile",
            },
          ],
          pageInfo: {
            totalDocs: 6,
            limit: 10,
            offset: null,
            hasPrevPage: false,
            hasNextPage: false,
            page: 1,
            totalPages: 1,
            pagingCounter: 1,
            prevPage: null,
            nextPage: null,
            __typename: "PageInfo",
          },
          __typename: "ProfileConnection",
        },
      },
    },
    newData: () => ({
      data: {
        profiles: {
          data: [
            {
              _id: "62e14eb149003e0013e02895",
              firstName: "Damilare",
              lastName: "Heala",
              height: null,
              weight: null,
              bloodGroup: null,
              dociId: "HEALA-EBDASEHA",
              genotype: null,
              gender: "Male",
              phoneNumber: "08109605535",
              provider: "Paelon Memorial Hospital",
              plan: "Basic",
              status: "Active",
              consultations: 0,
              createdAt:
                "Wed Jul 27 2022 14:41:53 GMT+0000 (Coordinated Universal Time)",
              image: null,
              __typename: "Profile",
            },
          ],
          pageInfo: {
            totalDocs: 6,
            limit: 10,
            offset: null,
            hasPrevPage: false,
            hasNextPage: false,
            page: 1,
            totalPages: 1,
            pagingCounter: 1,
            prevPage: null,
            nextPage: null,
            __typename: "PageInfo",
          },
          __typename: "ProfileConnection",
        },
      },
    }),
  },
  {
    request: {
      query: getProviders,
    },
    result: {
      data: {
        rates: [
          {
            __typename: "ExchangeRate",
            currency: "YOLO",
          },
        ],
      },
    },
    newData: () => ({
      data: {
        getProviders: {
          provider: [
            {
              _id: "61ca53ea29e4de24a49d2636",
              name: "Paelon Memorial Hospital",
              icon: "https://dq1z5gvyi71s7.cloudfront.net/2022-04-01-17-35-101293.png",
              userTypeId: "61ed2354e6091400135e3d94",
              createdAt:
                "Tue Dec 28 2021 00:01:46 GMT+0000 (Coordinated Universal Time)",
              updatedAt:
                "Mon Apr 11 2022 15:23:35 GMT+0000 (Coordinated Universal Time)",
              __typename: "Provider",
            },
          ],
          pageInfo: {
            totalDocs: 7,
            limit: 10,
            offset: null,
            hasPrevPage: false,
            hasNextPage: false,
            page: 1,
            totalPages: 1,
            pagingCounter: 1,
            prevPage: null,
            nextPage: null,
            __typename: "PageInfo",
          },
          __typename: "ProviderConnection",
        },
      },
    }),
  },
];
