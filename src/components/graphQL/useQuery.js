import { PageInfo } from "./fragment";
import { gql } from "@apollo/client";
export const getPartner = gql`
  query getPartner($id: String!) {
    getPartner(accountId: $id) {
      _id
      name
      profileUrl
      email
      category
      logoImageUrl
    }
  }
`;
export const getDoctorAvailabilityForDate = gql`
  query getDoctorAvailabilityForDate($doctor: String!, $day: String) {
    getDoctorAvailabilityForDate(doctorId: $doctor, day: $day) {
      day
      available
      times {
        start
        stop
        available
      }
    }
  }
`;
export const getUserTypes = gql`
  ${PageInfo}
  query getUserTypes {
    getUserTypes(filterBy: { name: "HMO Enrollee" }) {
      userType {
        _id
        name
        icon
        description
        providerCount
        createdAt
        updatedAt
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const getUserTypeProviders = gql`
  query getUserTypeProviders($id: String) {
    getUserTypeProviders(filterBy: { userTypeId: $id }) {
      provider {
        _id
        name
        icon
        userTypeId
        userCount
        doctorCount
        enrolleeCount
        partnerCount
        createdAt
        updatedAt
        userTypeData {
          name
          icon
          createdAt
          updatedAt
        }
      }
      pageInfo {
        totalDocs
        limit
        offset
        hasPrevPage
        hasNextPage
        page
        totalPages
        pagingCounter
        prevPage
        nextPage
      }
    }
  }
`;
export const getDiagnosticDashboard = gql`
  query getDiagnosticDashboard($partner: String!) {
    getDiagnosticDashboard(partner: $partner) {
      testRequestsCount
      scheduledTestsCount
      completedTestsCount
      cancelledTestsCount
      testRequestsStats
      scheduledTestsStats
      completedTestsStats
      cancelledTestsStats
    }
  }
`;
export const getNotifications = gql`
  query getNotifications($user: String) {
    getNotifications(user: $user) {
      data {
        user
        content
        itemId
        ticker
        title
        seen
        tag
        useSound
        role
        saveNotification
        previewImageUri
        previewImageUriThumbnail
        createdAt
        updatedAt
      }
    }
  }
`;
export const getPharmacyDashboard = gql`
  query getPharmacyDashboard($partner: String!) {
    getPharmacyDashboard(partner: $partner) {
      drugOrderRequestsCount
      completedDrugOrdersCount
      processingDrugOrdersCount
      cancelledDrugOrdersCount
      drugOrderRequestsStats
      completedDrugOrdersStats
      processingDrugOrdersStats
      cancelledDrugOrdersStats
    }
  }
`;
export const doctor = gql`
  query doctorProfile($id: ID!) {
    doctorProfile(id: $id) {
      _id
      firstName
      lastName
      gender
      phoneNumber
      createdAt
      updatedAt
      email
      hospital
      specialization
      dob
      cadre
      picture
      provider
      consultations
      status
      dociId
    }
  }
`;
export const getProviders = gql`
  ${PageInfo}
  query getProviders(
    $name: String
    $userTypeId: String
    $page: Int
    $first: Int
  ) {
    getProviders(
      filterBy: { name: $name, userTypeId: $userTypeId }
      page: $page
      orderBy: "-createdAt"
      first: $first
    ) {
      provider {
        _id
        name
        icon
        userTypeId
        createdAt
        updatedAt
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
// export const getPatients = gql`

//   ${PageInfo}
//   query findProfiles(
//     $gender: String
//     $page: Int
//     $first: Int
//     $firstName: String
//     $lastName: String
//     $id: String
//     $provider: String
//   ) {
//     profiles(
//       filterBy: {
//         gender: $gender
//         dociId: $id
//         firstName: $firstName
//         lastName: $lastName
//         providerId: $provider
//       }
//       orderBy: "-createdAt"
//       page: $page
//       first: $first
//     ) {
//       data {
//         _id
//         firstName
//         lastName
//         height
//         weight
//         bloodGroup
//         dociId
//         genotype
//         gender
//         phoneNumber
//         provider
//         plan
//         status
//         consultations
//         createdAt
//         image
//       }
//       pageInfo {
//         ...pageDetails
//       }
//     }
//   }
// `;
export const getDrugOrders = gql`
  ${PageInfo}
  query getDrugOrders(
    $page: Int
    $first: Int
    $status: String
    $orderId: String
    $partnerProviderId: String!
  ) {
    getDrugOrders(
      filterBy: {
        status: $status
        partner: $partnerProviderId
        orderId: $orderId
      }
      first: $first
      page: $page
      orderBy: "-createdAt"
    ) {
      data {
        _id
        partner
        patient
        doctor
        orderId

        deliveryOption
        consultationId
        note
        cancellationReason
        partnerData
        doctorData
        patientData
        total
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
          state
          lga
          landmark
          lat
          lng
        }
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const getPatientsByPlan = gql`
  ${PageInfo}
  query findProfiles($planId: String, $first: Int, $id: String) {
    profilesByPlan(
      filterBy: { planId: $planId }
      orderBy: "-createdAt"
      first: $first
      id: $id
    ) {
      data {
        _id
        firstName
        lastName
        height
        weight
        bloodGroup
        dociId
        genotype
        gender
        phoneNumber
        provider
        plan
        status
        consultations
        createdAt
        image
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const getPatientsByStatus = gql`
  ${PageInfo}
  query findProfiles($status: Boolean, $first: Int) {
    profilesByStatus(
      filterBy: { isActive: $status }
      orderBy: "-createdAt"
      first: $first
    ) {
      data {
        _id
        firstName
        lastName
        height
        weight
        bloodGroup
        dociId
        genotype
        gender
        phoneNumber
        provider
        plan
        status
        consultations
        createdAt
        image
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const findAdmin = gql`
  ${PageInfo}
  query findAccounts($role: String, $email: String, $page: Int) {
    accounts(
      filterBy: { role: $role, email: $email }
      page: $page
      orderBy: "-createdAt"
    ) {
      data {
        _id
        role
        email
        dociId
        createdAt
        updatedAt
        role
        isActive
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const findAllergies = gql`
  query findAllergies($id: String!) {
    findAllergies(filterBy: { profile: $id }) {
      allergies {
        _id
        medication
        severity
        food
      }
    }
  }
`;
export const getDoctorsProfileByStatus = gql`
  ${PageInfo}
  query doctorProfiles(
    $id: String
    $firstName: String
    $lastName: String
    $gender: String
    $cadre: String
    $providerId: String
    $specialization: String
    $page: Int
    $first: Int
  ) {
    doctorProfilesByStatus(
      filterBy: { isActive: $status, role: "doctor" }
      first: $first
      page: $page
      providerId: $providerId
    ) {
      profile {
        _id
        firstName
        lastName
        gender
        phoneNumber
        createdAt
        updatedAt
        email
        hospital
        specialization
        dob
        cadre
        picture
        provider
        consultations
        status
        dociId
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;

export const findProfile = gql`
  query findProfile($id: ID!) {
    profile(id: $id) {
      _id
      firstName
      lastName
      height
      weight
      bloodGroup
      email
      genotype
      gender
      phoneNumber
      provider
      plan
      dociId
      status
      consultations
      createdAt
      image
    }
  }
`;
export const getAMessage = gql`
  query getMessage($id: ID!) {
    getMessage(id: $id) {
      _id
      recipient
      subject
      sender
      createdAt
      updatedAt
      body
    }
  }
`;
export const getDrugOrder = gql`
  query getDrugOrder($id: String!) {
    getDrugOrder(id: $id) {
      _id
      partner
      patient
      doctor
      orderId
      status
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
  }
`;
export const getAppoint = gql`
  ${PageInfo}
  query getAppointments($id: ID!, $orderBy: String, $page: Int, $first: Int) {
    getAppointments(
      filterBy: { patient: $id }
      page: $page
      orderBy: $orderBy
      first: $first
    ) {
      data {
        _id
        doctor
        patient
        date
        time
        createdAt
        updatedAt
        patientData
        doctorData
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const cancelDrugOrder = gql`
  mutation cancelDrugOrder($id: String, $reason: String) {
    cancelDrugOrder(data: { id: $id, reason: $reason }) {
      drugOrder {
        _id
        partner
        patient
        doctor
        orderId
        status
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
export const getConsult = gql`
  query getConsultation($id: ID!) {
    getConsultation(id: $id) {
      _id
      patient
      consultationOwner
      symptoms {
        name
      }
      description
      discomfortLevel
      firstNotice
      doctor
      doctorData
      patientData
      providerId
      declineReason
      consultationDuration
      diagnosis {
        ailment
        severity
      }
      doctorNote
      createdAt
      updatedAt
      referralId
      prescription {
        _id
        drugs {
          priceListId
          drugName
          drugPrice
          unitPrice
          dosageQuantity
          dosageUnit
          route
          amount
          instructions
          dosageFrequency {
            timing
            duration
          }
        }
      }
    }
  }
`;
export const getConsultations = gql`
  ${PageInfo}
  query getConsultations($id: ID!, $orderBy: String!, $page: Int, $first: Int) {
    getConsultations(
      filterBy: { patient: $id }
      orderBy: $orderBy
      page: $page
      first: $first
    ) {
      data {
        _id
        patient
        consultationOwner
        symptoms {
          name
        }
        description
        discomfortLevel
        firstNotice
        doctor
        consultationDuration
        diagnosis {
          ailment
          severity
        }
        doctorNote
        declineReason
        createdAt
        updatedAt
        patientData
        doctorData
        referralId
        providerId
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const getDiagnosticTests = gql`
  ${PageInfo}
  query getDiagnosticTests(
    $status: String
    $page: Int
    $first: Int
    $testId: String
    $partnerProviderId: String!
  ) {
    getDiagnosticTests(
      filterBy: {
        testId: $testId
        status: $status
        partner: $partnerProviderId
      }
      orderBy: "-createdAt"
      page: $page
      first: $first
    ) {
      data {
        _id
        partner
        patient
        doctor
        referralId
        note
        sampleCollection
        testResults
        cancellationReason
        patientData
        doctorData
        testId
        partnerData
        tests {
          paid
          price
          _id
          tat
          partner
          name
        }
        time
        scheduledAt
        userLocation {
          address
          phoneNumber
          city
          lat
          lng
        }
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
// export const getDiagnosticTests = gql`
//   ${PageInfo}
//   query getDiagnosticTests(
//     $status: String
//     $page: Int
//     $first: Int
//     $testId: String
//     $partnerProviderId: String!
//   ) {
//     getDiagnosticTests(
//       filterBy: {
//         testId: $testId
//         status: "pending"
//         partner: $partnerProviderId
//       }
//       orderBy: "-createdAt"
//       page: $page
//       first: $first
//     ) {
//       data {
//         _id
//         partner
//         patient
//         doctor
//         reason
//         referralId
//         note
//         sampleCollection
//         testResults
//         cancellationReason
//         partnerData
//         scheduledAt
//         userLocation {
//           address
//           phoneNumber
//           city
//           lat
//           lng
//         }
//       }
//       pageInfo {
//         ...pageDetails
//       }
//     }
//   }
// `;
export const cancelDiagnosticReferral = gql`
  query cancelDiagnosticReferral($id: String) {
    cancelDiagnosticReferral(id: $id) {
      _id
      partner
      patient
      patientData
      doctorData
      doctor

      testId
      referralId
      note
      reason
      sampleCollection
      createdAt
      userLocation {
        address
        city
        lat
        lng
      }
    }
  }
`;
export const getDiagnosticTest = gql`
  query getDiagnosticTest($id: String) {
    getDiagnosticTest(id: $id) {
      _id
      partner
      patient
      doctor
      reason
      referralId
      note
      testId
      status
      patientData
      scheduledAt
      doctorData
      sampleCollection
      testResults
      cancellationReason
      partnerData
      createdAt
      tests {
        name
        price
        tat
        paid
      }
      userLocation {
        address
        phoneNumber
        city
        lat
        lng
      }
    }
  }
`;
export const getDOCAppoint = gql`
  query getAppointments($id: ID!, $orderBy: String!) {
    getAppointments(filterBy: { doctor: $id }, orderBy: $orderBy) {
      data {
        _id
        doctor
        patient
        date
        time
        createdAt
        updatedAt
        patientData
        doctorData
      }
    }
  }
`;

export const getDocConsult = gql`
  ${PageInfo}
  query getConsultations($id: String!, $page: Int, $first: Int) {
    getConsultations(filterBy: { doctor: $id }, page: $page, first: $first) {
      data {
        _id
        patient
        consultationOwner
        symptoms {
          name
        }
        description
        discomfortLevel
        firstNotice
        doctor
        consultationDuration
        diagnosis {
          ailment
          severity
        }
        doctorNote
        declineReason
        createdAt
        updatedAt
        patientData
        doctorData
        referralId
        providerId
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const getDoctorPatients = gql`
  ${PageInfo}
  query getDoctorPatients($id: String!, $page: Int, $first: Int) {
    getDoctorPatients(filterBy: { doctor: $id }, page: $page, first: $first) {
      data {
        _id
        doctor
        patient
        createdAt
        updatedAt
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const getDoctorsProfile = gql`
  ${PageInfo}
  query doctorProfiles(
    $id: String
    $firstName: String
    $lastName: String
    $gender: String
    $cadre: String
    $providerId: String
    $specialization: String
    $page: Int
    $first: Int
  ) {
    doctorProfiles(
      filterBy: {
        dociId: $id
        firstName: $firstName
        lastName: $lastName
        gender: $gender
        cadre: $cadre
        providerId: $providerId
        specialization: $specialization
      }
      first: $first
      page: $page
    ) {
      profile {
        _id
        firstName
        lastName
        gender
        phoneNumber
        createdAt
        updatedAt
        email
        hospital
        specialization
        dob
        cadre
        picture
        provider
        consultations
        status
        dociId
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const getEarningStats = gql`
  query getEarningStats($page: Int, $providerId: String) {
    getEarningStats(
      filterBy: { providerId: $providerId }
      q: "365"
      page: $page
    ) {
      totalEarnings
      totalPayout
      earningData
      payoutData
    }
  }
`;

export const getMyEarningDoc = gql`
  query getMyEarnings($doctor: String) {
    getMyEarnings(filterBy: { doctor: $doctor }, page: 1) {
      data {
        _id
        doctor
        balance
        doctorData
        createdAt
        updatedAt
      }
      pageInfo {
        totalDocs
        limit
        offset
        hasPrevPage
        hasNextPage
        page
        totalPages
        pagingCounter
        prevPage
        nextPage
      }
      errors {
        field
        message
      }
    }
  }
`;
export const getEmailList = gql`
  query getEmailList {
    getEmailList(orderBy: "-createdAt") {
      data {
        _id
        email
        createdAt
        updatedAt
        profileData
        role
        email
      }
    }
  }
`;
export const getLabResult = gql`
  query getLabResults($id: ID!) {
    getLabResults(filterBy: { patient: $id }) {
      lab {
        _id
        url
        partner
        doctor
        createdAt
        updatedAt
      }
    }
  }
`;
export const getMessage = gql`
  ${PageInfo}
  query getMessages($recipient: String, $providerId: String, $page: Int) {
    getMessages(
      filterBy: { providerId: $providerId, recipient: $recipient }
      page: $page
      orderBy: "-createdAt"
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
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const getPatients = gql`
  ${PageInfo}
  query findProfiles(
    $gender: String
    $providerId: String
    $firstName: String
    $lastName: String
    $page: Int
    $id: String
    $first: Int
  ) {
    profiles(
      filterBy: {
        providerId: $providerId
        gender: $gender
        dociId: $id
        firstName: $firstName
        lastName: $lastName
      }
      orderBy: "-createdAt"
      page: $page
      first: $first
    ) {
      data {
        _id
        firstName
        lastName
        height
        weight
        bloodGroup
        dociId
        genotype
        gender
        phoneNumber
        provider
        plan
        status
        consultations
        createdAt
        image
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;

export const getSubscriptionsIncome = gql`
  query getEarningStats($first: Int, $page: Int, $providerId: String) {
    getEarningStats(
      filterBy: { providerId: $providerId }
      q: "365"
      page: $page
      orderBy: "-createdAt"
      first: $first
    ) {
      subscriptionIncomeData
    }
  }
`;

export const getAvailabilities = gql`
  ${PageInfo}
  query getAvailabilities(
    $id: String
    $providerId: String
    $page: Int
    $day: String
    $first: Int
  ) {
    getAvailabilities(
      filterBy: { doctor: $id, providerId: $providerId, day: $day }
      page: $page
      first: $first
    ) {
      availability {
        _id
        doctor
        doctorData
        createdAt
        updatedAt
        providerId
        day
        available
        times {
          start
          stop
          available
        }
      }
      pageInfo {
        ...pageDetails
      }
      errors {
        field
        message
      }
    }
  }
`;

export const getMyEarnings = gql`
  ${PageInfo}
  query getMyEarnings($doctor: String, $page: Int, $first: Int) {
    getMyEarnings(
      filterBy: { doctor: $doctor }
      first: $first
      page: $page
      orderBy: "-createdAt"
    ) {
      data {
        _id
        doctor
        balance
        doctorData
        createdAt
        updatedAt
      }
      totalEarnings
      totalPayouts
      pageInfo {
        ...pageDetails
      }
      errors {
        field
        message
      }
    }
  }
`;
export const getPayouts = gql`
  ${PageInfo}
  query getPayouts($page: Int, $doctor: String, $first: Int) {
    getPayouts(filterBy: { doctor: $doctor }, page: $page, first: $first) {
      data {
        _id
        doctor
        amount
        status
        createdAt
        updatedAt
        providerId
        providerData
      }
      pageInfo {
        ...pageDetails
      }
      errors {
        field
        message
      }
    }
  }
`;
export const getPayoutData = gql`
  query getEarningStats(
    $first: Int
    $page: Int
    $status: String
    $doctor: String
  ) {
    getEarningStats(
      filterBy: { status: $status, doctor: $doctor }
      q: "365"
      page: $page
      first: $first
      orderBy: "-createdAt"
    ) {
      payoutData
    }
  }
`;

export const dashboard = gql`
  query getStats($providerId: String, $q: String) {
    getStats(filterBy: { providerId: $providerId }, q: $q) {
      patientStats {
        totalActive
        totalInactive
        activeChartData
        inactiveChartData
      }
      doctorStats {
        totalActive
        totalInactive
        activeChartData
        inactiveChartData
      }
      partnerStats {
        total
        chartData
        hospitalChartData
        diagnosticsChartData
        pharmacyChartData
        totalHospitals
        totalPharmacies
        totalDiagnostics
      }
      subscriptionStats {
        totalActive
        totalInactive
        chartData
        activeChartData
        inactiveChartData
      }
      earningStats {
        total
        chartData
      }
      payoutStats {
        total
        chartData
      }
      consultationStats {
        totalOngoing
        totalAccepted
        totalCompleted
        totalDeclined
        totalCancelled
        ongoingChartData
        acceptedChartData
        completedChartData
        declinedChartData
        cancelledChartData
      }
      availabilityCalender {
        today
        availableDoctors {
          dociId
          firstName
          lastName
          providerId
          availability {
            times {
              start
              stop
              available
            }
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;
export const dashboard1 = gql`
  query getStats {
    getStats(filterBy: {}, q: $q) {
      patientStats {
        totalActive
        totalInactive
        activeChartData
        inactiveChartData
      }
      doctorStats {
        totalActive
        totalInactive
        activeChartData
        inactiveChartData
      }
      partnerStats {
        total
        chartData
        hospitalChartData
        diagnosticsChartData
        pharmacyChartData
        totalHospitals
        totalPharmacies
        totalDiagnostics
      }
      subscriptionStats {
        totalActive
        totalInactive
        chartData
        activeChartData
        inactiveChartData
      }
      earningStats {
        total
        chartData
      }
      payoutStats {
        total
        chartData
      }
      consultationStats {
        totalOngoing
        totalAccepted
        totalCompleted
        totalDeclined
        totalCancelled
        ongoingChartData
        acceptedChartData
        completedChartData
        declinedChartData
        cancelledChartData
      }
      availabilityCalender {
        today
        availableDoctors {
          dociId
          firstName
          lastName
          providerId
          availability {
            times {
              start
              stop
              available
            }
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;

export const getPlans = gql`
  ${PageInfo}
  query getPlans($amount: Float, $provider: String, $page: Int, $first: Int) {
    getPlans(
      filterBy: { amount: $amount, provider: $provider }
      page: $page
      orderBy: "-createdAt"
      first: $first
    ) {
      plan {
        _id
        name
        amount
        description
        providerData
        provider
        duration
        createdAt
        updatedAt
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const getProfile = gql`
  query findProfile($profileId: ID!) {
    profile(id: $profileId) {
      _id
      firstName
      lastName
      height
      email
      weight
      bloodGroup
      genotype
      gender
      phoneNumber
      provider
      plan
      status
      dociId
      consultations
      createdAt
      image
    }
  }
`;
export const getRefferal = gql`
  query getReferral($id: ID!) {
    getReferral(id: $id) {
      _id
      doctor
      patient
      type
      reason
      note
      specialization
      createdAt
      updatedAt
      doctorData
      patientData
    }
  }
`;
export const getRefferals = gql`
  ${PageInfo}
  query getReferrals(
    $doctor: String
    $id: String
    $page: Int
    $specialization: String
    $patient: String
    $providerId: String
  ) {
    getReferrals(
      filterBy: {
        doctor: $doctor
        providerId: $providerId
        _id: $id
        specialization: $specialization
        patient: $patient
      }
      orderBy: "-createdAt"
      page: $page
    ) {
      referral {
        _id
        doctor
        patient
        type
        reason
        note
        specialization
        createdAt
        updatedAt
        doctorData
        patientData
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const getRoles = gql`
  ${PageInfo}
  query getRoles($name: String, $page: Int) {
    getRoles(filterBy: { name: $name }, page: $page, orderBy: "-createdAt") {
      role {
        _id
        name
        permissions
        editable
        description
        createdAt
        updatedAt
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const myMedic = gql`
  ${PageInfo}
  query getMyMedications($id: ID!, $orderBy: String!, $page: Int) {
    getMedications(filterBy: { patient: $id }, page: $page, orderBy: $orderBy) {
      medication {
        _id
        name
        interval
        createdAt
        updatedAt
        doctor
        dosage
        patient
      }
      pageInfo {
        ...pageDetails
      }
    }
  }
`;
export const verifiedEmail = gql`
  query findAccounts($dociId: String) {
    accounts(filterBy: { dociId: $dociId }) {
      data {
        isEmailVerified
      }
    }
  }
`;
export const getDoctorByDociId = gql`
  query doctorProfiles($dociId: String!) {
    doctorProfiles(filterBy: { dociId: $dociId }) {
      profile {
        firstName
        lastName
      }
    }
  }
`;
export const getProfileByDociId = gql`
  query findProfiles($dociId: String!) {
    profiles(filterBy: { dociId: $dociId }) {
      data {
        _id
        firstName
        lastName
      }
    }
  }
`;
export const getAvailability = gql`
  query getAvailabilities($id: String!) {
    getAvailabilities(filterBy: { doctor: $id }) {
      availability {
        _id
        createdAt
        updatedAt
        day
        available
        times {
          start
          stop
        }
      }
      errors {
        field
        message
      }
    }
  }
`;
export const getSinglePlan = gql`
  query getPlan($id: ID!) {
    getPlan(id: $id) {
      name
      amount
      description
      provider
      duration
    }
  }
`;
export const getUsertypess = gql`
  query getUserTypeProviders($userTypeId: String) {
    getUserTypeProviders(filterBy: { userTypeId: $userTypeId }) {
      provider {
        _id
        name
        icon
        userTypeId
        createdAt
        updatedAt
        userTypeData {
          name
          icon
          createdAt
          updatedAt
        }
      }
      pageInfo {
        totalDocs
        limit
        offset
        hasPrevPage
        hasNextPage
        page
        totalPages
        pagingCounter
        prevPage
        nextPage
      }
    }
  }
`;
