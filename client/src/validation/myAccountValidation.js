import * as yup from "yup";

export const myAccountSchema = yup.object({
  first_name: yup
    .string()
    .required("First Name field is required")
    .matches(/^([^0-9]*)$/, {
      message: "Invalid First Name",
      excludeEmptyString: true,
    }),
  middle_name: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Middle Name",
    excludeEmptyString: true,
  }),
  last_name: yup
    .string()
    .required("First Name field is required")
    .matches(/^([^0-9]*)$/, {
      message: "Invalid Last Name",
      excludeEmptyString: true,
    }),
  speciality: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Speciality field",
    excludeEmptyString: true,
  }),
  subspeciality: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Subspeciality field",
    excludeEmptyString: true,
  }),
  cell_phone: yup
    .string()
    .required("Cell Phone field is required")
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      { message: "Invalid Cell Phone number", excludeEmptyString: true }
    ),
  backup_phone: yup
    .string()
    .matches(
      /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      { message: "Invalid Backup Phone number", excludeEmptyString: true }
    ),
});
