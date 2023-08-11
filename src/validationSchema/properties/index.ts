import * as yup from 'yup';

export const propertyValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().nullable(),
  location: yup.string().required(),
  company_id: yup.string().nullable(),
});
