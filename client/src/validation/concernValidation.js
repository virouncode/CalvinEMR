import * as yup from "yup";

export const concernSchema = yup.object({
  concern: yup.string().required("Concern description field is required"),
});
