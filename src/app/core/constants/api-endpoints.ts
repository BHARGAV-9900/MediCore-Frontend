export const ApiEndpoints = {

  AUTH: {

    LOGIN: 'Authentication/login',

    LOGOUT: 'Authentication/logout',

    ME: 'Authentication/me',

    REFRESH_TOKEN: 'Authentication/refresh-token',

    CHANGE_PASSWORD: 'Authentication/change-password'

  },


  DEPARTMENT: {

    GET_ALL: 'Department',

    GET_BY_ID: 'Department',

    CREATE: 'Department',

    UPDATE: 'Department',

    DELETE: 'Department'

  },


  PATIENT: {

    GET_ALL: 'Patient',

    GET_BY_ID: 'Patient',

    CREATE: 'Patient',

    UPDATE: 'Patient',

    DELETE: 'Patient',

    PAGED: 'Patient/paged'

  },


  DOCTOR: {

    GET_ALL: 'Doctors',

    GET_BY_ID: 'Doctors',

    CREATE: 'Doctors',

    UPDATE: 'Doctors',

    DELETE: 'Doctors'

  },


  APPOINTMENT: {

    GET_ALL: 'Appointment',

    GET_BY_ID: 'Appointment',

    CREATE: 'Appointment',

    UPDATE: 'Appointment',

    DELETE: 'Appointment',

    UPDATE_STATUS: 'Appointment'

  },


  LABORATORY_TEST: {

    GET_ALL: 'LaboratoryTest',

    GET_BY_ID: 'LaboratoryTest',

    CREATE: 'LaboratoryTest',

    UPDATE: 'LaboratoryTest',

    DELETE: 'LaboratoryTest'

  },


  LABORATORY_ORDER: {

    GET_ALL: 'LaboratoryOrder',

    GET_BY_ID: 'LaboratoryOrder',

    CREATE: 'LaboratoryOrder',

    UPDATE: 'LaboratoryOrder',

    DELETE: 'LaboratoryOrder'

  },


  LABORATORY_RESULT: {

    GET_ALL: 'LaboratoryResult',

    GET_BY_ID: 'LaboratoryResult',

    CREATE: 'LaboratoryResult',

    UPDATE: 'LaboratoryResult',

    DELETE: 'LaboratoryResult'

  },


  MEDICINE: {

    GET_ALL: 'Medicine',

    GET_BY_ID: 'Medicine',

    CREATE: 'Medicine',

    UPDATE: 'Medicine',

    DELETE: 'Medicine'

  },


  PRESCRIPTION: {

    GET_ALL: 'Prescription',

    GET_BY_ID: 'Prescription',

    CREATE: 'Prescription',

    UPDATE: 'Prescription',

    DELETE: 'Prescription'

  },


  PRESCRIPTION_ITEM: {

    GET_ALL: 'PrescriptionItem',

    GET_BY_ID: 'PrescriptionItem',

    GET_BY_PRESCRIPTION: 'PrescriptionItem/prescription',

    CREATE: 'PrescriptionItem',

    UPDATE: 'PrescriptionItem',

    DELETE: 'PrescriptionItem'

  },


  BILL: {

    GET_ALL: 'Bill',

    GET_BY_ID: 'Bill',

    CREATE: 'Bill',

    UPDATE: 'Bill',

    DELETE: 'Bill'

  },


  NOTIFICATION: {

    GET_ALL: 'Notification',

    GET_BY_ID: 'Notification',

    GET_UNREAD: 'Notification/unread',

    MARK_AS_READ: 'Notification/read',

    CREATE: 'Notification',

    DELETE: 'Notification'

  },


  USER: {

    GET_ALL: 'User',

    GET_BY_ID: 'User',

    CREATE: 'User',

    UPDATE: 'User',

    ACTIVATE: 'User',

    DEACTIVATE: 'User',

    DELETE: 'User'

  }

};