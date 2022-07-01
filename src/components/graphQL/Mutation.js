import { gql } from "@apollo/client";
export const updateDrugOrder = gql`
  mutation updateDrugOrder($id: String) {
    updateDrugOrder(data: { id: $id, status: "processing" }) {
      drugOrder {
        _id
      }
      errors {
        field
        message
      }
    }
  }
`;

export const Login_USER = gql`
  mutation Login($data: LoginUserInput!) {
    login(data: $data) {
      message
      account {
        _id
        dociId
        access_token
        refresh_token
        role
        providerId
        userTypeId
        email
      }
      errors {
        message
      }
    }
  }
`;
export const CREATE_MESSAGE = gql`
  mutation createMessage(
    $recipient: String!
    $sender: String!
    $subject: String!
    $body: String!
  ) {
    createMessage(
      data: {
        recipient: $recipient
        sender: $sender
        subject: $subject
        body: $body
      }
    ) {
      messages {
        _id
        recipient
        subject
        sender
        createdAt
        updatedAt
        body
      }
      errors {
        field
        message
      }
    }
  }
`;
export const DELETE_PERMISSION = gql`
  mutation deletePermission($id: String!) {
    deletePermission(data: { id: $id }) {
      count
      message
      errors {
        field
        message
      }
    }
  }
`;
export const DELETE_PLAN = gql`
  mutation deletePlan($id: String!) {
    deletePlan(data: { id: $id }) {
      count
      message
      errors {
        field
        message
      }
    }
  }
`;
export const UPDATE_PLAN = gql`
  mutation updatePlan(
    $id: String
    $name: String
    $amount: Float
    $provider: String
    $description: String
  ) {
    updatePlan(
      data: {
        id: $id
        name: $name
        amount: $amount
        provider: $provider
        description: $description
      }
    ) {
      plan {
        _id
        name
        amount
        description
        createdAt
        updatedAt
      }
      errors {
        field
        message
      }
    }
  }
`;
export const createDOctorProfile = gql`
  mutation createDoctorProfile(
    $firstName: String!
    $lastName: String!
    $gender: String
    $dociId: String!
    $phoneNumber: String!
    $hospital: String!
    $specialization: String!
    $dob: String!
    $cadre: String!
    $image: String!
    $providerId: String
  ) {
    createDoctorProfile(
      data: {
        firstName: $firstName
        lastName: $lastName
        gender: $gender
        phoneNumber: $phoneNumber
        dociId: $dociId
        hospital: $hospital
        specialization: $specialization
        dob: $dob
        cadre: $cadre
        image: $image
        providerId: $providerId
      }
    ) {
      profile {
        _id
        dociId
        createdAt
        updatedAt
        firstName
        lastName
        gender
        phoneNumber
        email
        hospital
        specialization
        dob
        cadre
        picture
      }
      errors {
        field
        message
      }
    }
  }
`;
export const deleteAppointment = gql`
  mutation deleteAppointment($id: String!) {
    deleteAppointment(data: { id: $id }) {
      count
      message
      errors {
        field
        message
      }
    }
  }
`;
export const deleteProfile = gql`
  mutation deleteProfile($id: String!) {
    deleteProfile(data: { id: $id }) {
      count
      errors {
        field
        message
      }
    }
  }
`;
export const deleteRole = gql`
  mutation deleteRole($id: String!) {
    deleteRole(data: { id: $id }) {
      count
      message
      errors {
        field
        message
      }
    }
  }
`;

export const deleteDoctor = gql`
  mutation deleteDoctorProfile($id: String!) {
    deleteDoctorProfile(data: { id: $id }) {
      count
      errors {
        field
        message
      }
    }
  }
`;
export const cancelDiagnosticTest = gql`
  mutation cancelDiagnosticTest($id: String!, $reason: String!) {
    cancelDiagnosticTest(data: { id: $id, reason: $reason }) {
      diagnosticTest {
        _id
        partner
        patient
        doctor
        reason
        referralId
        note
        time
        sampleCollection
        testResults
        cancellationReason
        userLocation {
          address
          city
          lat
          lng
        }
      }
      errors {
        field
        message
      }
    }
  }
`;
export const completeDiagnosticTest = gql`
  mutation completeDiagnosticTest($id: String!, $testResults: [JSONObject]) {
    completeDiagnosticTest(data: { id: $id, testResults: $testResults }) {
      diagnosticTest {
        _id
        partner
        patient
        doctor
        reason
        referralId
        note
        time
        sampleCollection
        testResults
        cancellationReason
        userLocation {
          address
          city
          lat
          lng
        }
      }
      errors {
        field
        message
      }
    }
  }
`;
export const scheduleDiagnosticTest = gql`
  mutation scheduleDiagnosticTest($id: String!, $time: String) {
    scheduleDiagnosticTest(data: { id: $id, time: $time }) {
      diagnosticTest {
        _id
        partner
        patient
        doctor
        reason
        referralId
        note
        time
        sampleCollection
        testResults
        cancellationReason
        userLocation {
          address
          city
          lat
          lng
        }
      }
      errors {
        field
        message
      }
    }
  }
`;
export const LOGOUT_USER = gql`
  mutation logout($user: String!, $deviceId: String) {
    logout(data: { user: $user, deviceId: $deviceId }) {
      result
    }
  }
`;

export const updatePartner = gql`
  mutation updatePartnerProfile(
    $id: String
    $name: String
    $category: String
    $email: String
    $logoImageUrl: String
  ) {
    updatePartnerProfile(
      data: {
        id: $id
        name: $name
        category: $category
        email: $email
        logoImageUrl: $logoImageUrl
      }
    ) {
      partner {
        _id
        name
        email
        category
        logoImageUrl
        accountId
        dociId
      }
      errors {
        field
        message
      }
    }
  }
`;
export const fulfillDrugOrder = gql`
  mutation fulfillDrugOrder($id: String) {
    fulfillDrugOrder(data: { id: $id }) {
      drugOrder {
        _id
        partner
        patient
        doctor
        orderId
        status
        reason
        consultationId
        note
        cancellationReason
        partnerData
        doctorData
        patientData
        prescriptions {
          priceListId
          drugName
          drugPrice
          unitPrice
          dosageQuantity
          notes
        }
        userLocation {
          address
          phoneNumber
          city
          lat
          lng
        }
      }
      errors {
        field
        message
      }
    }
  }
`;
export const signup = gql`
  mutation signup(
    $authType: String!
    $email: EmailAddress!
    $password: String!
    $role: String
  ) {
    signup(
      data: {
        authType: $authType
        email: $email
        password: $password
        role: $role
      }
    ) {
      account {
        _id
        email
      }
      message
      errors {
        field
        message
      }
    }
  }
`;
export const updateAppointment = gql`
  mutation updateAppointment(
    $id: String!
    $doctor: String!
    $patient: String
    $date: String!
    $time: String
  ) {
    updateAppointment(
      data: {
        id: $id
        doctor: $doctor
        patient: $patient
        date: $date
        time: $time
      }
    ) {
      appointment {
        _id
        doctor
        patient
        date
        time
        createdAt
        updatedAt
      }
      errors {
        field
        message
      }
    }
  }
`;
export const verifyHCP = gql`
  mutation verifyHCP($id: String) {
    verifyHCP(data: { id: $id }) {
      _id
      qualification
      license
      yearbook
      alumni_association
      reference
      external_reference
      status
      createdAt
      updatedAt
      profileId
    }
  }
`;
export const requestReferral = gql`
  mutation requestReferral(
    $doctor: String!
    $patient: String!
    $type: String!
    $reason: String!
    $note: String!
    $specialization: String!
  ) {
    requestReferral(
      data: {
        doctor: $doctor
        patient: $patient
        type: $type
        reason: $reason
        note: $note
        specialization: $specialization
      }
    ) {
      referral {
        _id
        doctor
        patient
        type
        reason
        note
        specialization
        testType
        createdAt
        updatedAt
      }
      errors {
        field
        message
      }
    }
  }
`;
export const addRole = gql`
  mutation createRole(
    $name: String!
    $editable: Boolean
    $description: String
    $permissions: [String!]
  ) {
    createRole(
      data: {
        name: $name
        editable: $editable
        description: $description
        permissions: $permissions
      }
    ) {
      role {
        _id
        name
        permissions
        editable
        description
        createdAt
        updatedAt
      }
      errors {
        field
        message
      }
    }
  }
`;
export const CREATE_PLAN = gql`
  mutation createPlan(
    $name: String!
    $amount: Float!
    $description: String
    $duration: String
    $provider: String
  ) {
    createPlan(
      data: {
        name: $name
        amount: $amount
        description: $description
        duration: $duration
        provider: $provider
      }
    ) {
      plan {
        _id
        name
        amount
        description
        createdAt
        updatedAt
      }
      errors {
        field
        message
      }
    }
  }
`;

// export const DELETE_PLAN = gql`
//   mutation deletePlan($id: String!) {
//     deletePlan(data: { id: $id }) {
//       count
//       message
//       errors {
//         field
//         message
//       }
//     }
//   }
// `
// export const UPDATE_PLAN = gql`
//   mutation updatePlan(
//     $id: String
//     $name: String
//     $amount: Float
//     $provider: String
//     $description: String
//   ) {
//     updatePlan(
//       data: {
//         id: $id
//         name: $name
//         amount: $amount
//         provider: $provider
//         description: $description
//       }
//     ) {
//       plan {
//         _id
//         name
//         amount
//         description
//         createdAt
//         updatedAt
//       }
//       errors {
//         field
//         message
//       }
//     }
//   }
// `
