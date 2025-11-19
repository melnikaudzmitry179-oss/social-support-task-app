import i18next from "i18next";
import * as yup from "yup";

export const validateDubaiNationalId = (id: string): boolean => {
  const cleanedId = id.replace(/[\s-]/g, '');
  
  if (!/^\d{12}$/.test(cleanedId)) {
    return false;
  }
  
  const digits = cleanedId.split('').map(Number);
  
  const checkDigit = digits[11];
  const calculatedCheck = digits.slice(0, 11).reduce((sum, digit, index) => {
    return sum + (digit * (11 - index));
  }, 0) % 10;
  
  return calculatedCheck === checkDigit;
};

export const getFamilyFinancialInfoSchema = (t: (key: string) => string) =>
  yup
    .object({
      maritalStatus: yup
        .string()
        .required(t("validation.maritalStatusRequired")),
      dependents: yup
        .number()
        .min(0, t("validation.dependentsMin"))
        .required(t("validation.dependentsRequired"))
        .test(
          'no-leading-zeros',
          t("validation.dependentsNoLeadingZeros") || "Number should be 0 or start with 1-9",
          function(value) {
            if (value === undefined || value === null) return true;
            const stringValue = String(value);
            return !stringValue.startsWith('0') || stringValue === '0';
          }
        ),
      employmentStatus: yup
        .string()
        .required(t("validation.employmentStatusRequired")),
      monthlyIncome: yup
        .number()
        .min(0, t("validation.monthlyIncomeMin"))
        .required(t("validation.monthlyIncomeRequired"))
        .test(
          'no-leading-zeros',
          t("validation.monthlyIncomeNoLeadingZeros") || "Number should be 0 or start with 1-9",
          function(value) {
            if (value === undefined || value === null) return true;
            const stringValue = String(value);
            return !stringValue.startsWith('0') || stringValue === '0';
          }
        ),
      monthlyIncomeCurrency: yup
        .string()
        .oneOf(['USD', 'AED'], t("validation.currencyRequired") || "Currency is required")
        .required(t("validation.currencyRequired")),
      housingStatus: yup
        .string()
        .required(t("validation.housingStatusRequired")),
    })
    .defined();

export const getPersonalInfoSchema = (t: (key: string) => string) =>
  yup
    .object({
      name: yup
        .string()
        .required(t("validation.nameRequired"))
        .min(
          2,
          t("validation.nameMinLength") || "Name must be at least 2 characters"
        )
        .max(
          100,
          t("validation.nameMaxLength") || "Name must not exceed 100 characters"
        ),
      nationalId: yup
        .string()
        .required(t("validation.nationalIdRequired"))
        .min(
          12,
          t("validation.nationalIdMinLength") ||
            "National ID must be at least 12 characters"
        )
        .max(
          15,
          t("validation.nationalIdMaxLength") ||
            "National ID must not exceed 15 characters"
        )
        .test(
          "dubai-national-id",
          t("validation.dubaiNationalIdInvalid") ||
            "Invalid Dubai National ID format",
          function(value) {
            if (!value) return true;
            return validateDubaiNationalId(value);
          }
        ),
      dateOfBirth: yup
        .date()
        .nullable()
        .optional()
        .max(
          new Date(),
          t("validation.dateOfBirthPast") || "Date of birth must be in the past"
        )
        .test(
          "not-too-old",
          t("validation.dateOfBirthNotTooOld") ||
            "Date of birth must be within reasonable range (not older than 120 years)",
          function (value) {
            if (!value) return true;
            const today = new Date();
            const birthDate = new Date(value);
            const age = today.getFullYear() - birthDate.getFullYear();
            return age <= 120;
          }
        )
        .test(
          "minimum-age",
          t("validation.dateOfBirthMinAge") ||
            "Must be at least 18 years old",
          function (value) {
            if (!value) return true;
            const today = new Date();
            const birthDate = new Date(value);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();
            
            const exactAge = age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);
            return exactAge >= 18;
          }
        ),
      gender: yup.string().required(t("validation.genderRequired")),
      address: yup
        .string()
        .required(t("validation.addressRequired"))
        .min(
          5,
          t("validation.addressMinLength") ||
            "Address must be at least 5 characters"
        )
        .max(
          200,
          t("validation.addressMaxLength") ||
            "Address must not exceed 200 characters"
        ),
      city: yup
        .string()
        .required(t("validation.cityRequired"))
        .min(
          2,
          t("validation.cityMinLength") || "City must be at least 2 characters"
        )
        .max(
          50,
          t("validation.cityMaxLength") || "City must not exceed 50 characters"
        ),
      state: yup
        .string()
        .required(t("validation.stateRequired"))
        .min(
          2,
          t("validation.stateMinLength") ||
            "State must be at least 2 characters"
        )
        .max(
          50,
          t("validation.stateMaxLength") ||
            "State must not exceed 50 characters"
        ),
      country: yup
        .string()
        .required(t("validation.countryRequired"))
        .min(
          2,
          t("validation.countryMinLength") ||
            "Country must be at least 2 characters"
        )
        .max(
          50,
          t("validation.countryMaxLength") ||
            "Country must not exceed 50 characters"
        ),
      phone: yup
        .string()
        .required(t("validation.phoneRequired"))
        .matches(
          /^\+?[1-9]\d{0,15}$/,
          t("validation.phoneInvalid") || "Invalid phone number format"
        ),
      email: yup
        .string()
        .email(t("validation.emailInvalid"))
        .required(t("validation.emailRequired"))
        .max(
          100,
          t("validation.emailMaxLength") ||
            "Email must not exceed 100 characters"
        ),
    })
    .defined();

export const getSituationDescriptionsSchema = (t: (key: string) => string) =>
  yup
    .object({
      currentFinancialSituation: yup
        .string()
        .required(t("validation.currentFinancialSituationRequired")),
      employmentCircumstances: yup
        .string()
        .required(t("validation.employmentCircumstancesRequired")),
      reasonForApplying: yup
        .string()
        .required(t("validation.reasonForApplyingRequired")),
    })
    .defined();


import type { PersonalInfoFormData, FamilyFinancialInfoFormData, SituationDescriptionsFormData } from '../types/formTypes';

export const validatePersonalInfo = (
  data: Partial<PersonalInfoFormData>,
  t: typeof i18next.t
): Promise<boolean> => {
  const schema = getPersonalInfoSchema(t as (key: string) => string);
  return schema.validate(data, { abortEarly: false }).then(() => true);
};

export const validateFamilyFinancialInfo = (
  data: Partial<FamilyFinancialInfoFormData>,
  t: typeof i18next.t
): Promise<boolean> => {
  const schema = getFamilyFinancialInfoSchema(t as (key: string) => string);
  return schema.validate(data, { abortEarly: false }).then(() => true);
};

export const validateSituationDescriptions = (
  data: Partial<SituationDescriptionsFormData>,
  t: typeof i18next.t
): Promise<boolean> => {
  const schema = getSituationDescriptionsSchema(t as (key: string) => string);
  return schema.validate(data, { abortEarly: false }).then(() => true);
};
