import { PDFDocument } from "pdf-lib";
import { toLocalDate } from "./formatDates";
import { getAge } from "./getAge";

export const fillPdfForm = async (url, patientInfos, doctorInfos) => {
  console.log("patientInfos", patientInfos);
  if (!patientInfos) return;
  const formUrl = url;
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

  if (form.getFieldMaybe("full_name")) {
    const fullNameField = form.getFieldMaybe("full_name");
    fullNameField.setText(patientInfos.full_name);
  }
  if (form.getFieldMaybe("first_name")) {
    const firstNameField = form.getFieldMaybe("first_name");
    firstNameField.setText(patientInfos.first_name);
  }
  if (form.getFieldMaybe("middle_name")) {
    const middleNameField = form.getFieldMaybe("middle_name");
    middleNameField.setText(patientInfos.middle_name);
  }
  if (form.getFieldMaybe("last_name")) {
    const lastNameField = form.getFieldMaybe("last_name");
    lastNameField.setText(patientInfos.last_name);
  }
  if (form.getFieldMaybe("gender")) {
    const genderField = form.getFieldMaybe("gender");
    genderField.setText(patientInfos.gender_identification);
  }
  if (form.getFieldMaybe("chart_nbr")) {
    const chartField = form.getFieldMaybe("chart_nbr");
    chartField.setText(patientInfos.chart_nbr.toString());
  }
  if (form.getFieldMaybe("health_insurance_nbr")) {
    console.log("ok");
    const healthField = form.getFieldMaybe("health_insurance_nbr");
    healthField.setText(patientInfos.health_insurance_nbr);
  }
  if (form.getFieldMaybe("date_of_birth")) {
    const birthField = form.getFieldMaybe("date_of_birth");
    birthField.setText(toLocalDate(patientInfos.date_of_birth));
  }
  if (form.getFieldMaybe("age")) {
    const ageField = form.getFieldMaybe("age");
    ageField.setText(getAge(patientInfos.date_of_birth));
  }
  if (form.getFieldMaybe("email")) {
    const emailField = form.getFieldMaybe("email");
    emailField.setText(patientInfos.email);
  }
  if (form.getFieldMaybe("phone")) {
    const phoneField = form.getFieldMaybe("phone");
    phoneField.setText(patientInfos.preferred_phone);
  }
  if (form.getFieldMaybe("address")) {
    const addressField = form.getFieldMaybe("address");
    if (!form.getFieldMaybe("postal_code")) {
      addressField.setText(
        patientInfos.address +
          " " +
          patientInfos.postal_code +
          " " +
          patientInfos.province_state +
          " " +
          patientInfos.city +
          " " +
          patientInfos.country
      );
    } else {
      addressField.setText(patientInfos.address);
    }
  }
  if (form.getFieldMaybe("postal_code")) {
    const postalField = form.getFieldMaybe("postal_code");
    postalField.setText(patientInfos.postal_code);
  }
  if (form.getFieldMaybe("province_state")) {
    const provinceField = form.getFieldMaybe("province_state");
    provinceField.setText(patientInfos.province_state);
  }
  if (form.getFieldMaybe("city")) {
    const cityField = form.getFieldMaybe("city");
    cityField.setText(patientInfos.city);
  }
  if (form.getFieldMaybe("country")) {
    const countryField = form.getFieldMaybe("country");
    countryField.setText(patientInfos.country);
  }
  if (form.getFieldMaybe("doctor_name")) {
    const doctorNameField = form.getFieldMaybe("doctor_name");
    doctorNameField.setText("Dr. " + doctorInfos.full_name);
  }
  if (form.getFieldMaybe("doctor_phone")) {
    const doctorPhoneField = form.getFieldMaybe("doctor_phone");
    doctorPhoneField.setText(doctorInfos.phone);
  }

  if (form.getFieldMaybe("sign_image")) {
    const signUrl = doctorInfos.sign.url;
    const signImageBytes = await fetch(signUrl).then((res) =>
      res.arrayBuffer()
    );
    const signImage = await pdfDoc.embedPng(signImageBytes);
    const signImageField = form.getButton("sign_image");
    signImageField.setImage(signImage);
  }
  //   const ageField = form.getFieldMaybe('Age')
  //   const heightField = form.getFieldMaybe('Height')
  //   const weightField = form.getFieldMaybe('Weight')
  //   const eyesField = form.getFieldMaybe('Eyes')
  //   const skinField = form.getFieldMaybe('Skin')
  //   const hairField = form.getFieldMaybe('Hair')

  //   const alliesField = form.getFieldMaybe('Allies')
  //   const factionField = form.getFieldMaybe('FactionName')
  //   const backstoryField = form.getFieldMaybe('Backstory')
  //   const traitsField = form.getFieldMaybe('Feat+Traits')
  //   const treasureField = form.getFieldMaybe('Treasure')

  //   const characterImageField = form.getButton('CHARACTER IMAGE')
  //   const factionImageField = form.getButton('Faction Symbol Image')

  //   nameField.setText('Mario')
  //   ageField.setText('24 years')
  //   heightField.setText(`5' 1"`)
  //   weightField.setText('196 lbs')
  //   eyesField.setText('blue')
  //   skinField.setText('white')
  //   hairField.setText('brown')

  //   characterImageField.setImage(marioImage)

  //   alliesField.setText(
  //     [
  //       `Allies:`,
  //       `  • Princess Daisy`,
  //       `  • Princess Peach`,
  //       `  • Rosalina`,
  //       `  • Geno`,
  //       `  • Luigi`,
  //       `  • Donkey Kong`,
  //       `  • Yoshi`,
  //       `  • Diddy Kong`,
  //       ``,
  //       `Organizations:`,
  //       `  • Italian Plumbers Association`,
  //     ].join('\n'),
  //   )

  //   factionField.setText(`Mario's Emblem`)

  //   factionImageField.setImage(emblemImage)

  //   backstoryField.setText(
  //     [
  //       `Mario is a fictional character in the Mario video game franchise, `,
  //       `owned by Nintendo and created by Japanese video game designer Shigeru `,
  //       `Miyamoto. Serving as the company's mascot and the eponymous `,
  //       `protagonist of the series, Mario has appeared in over 200 video games `,
  //       `since his creation. Depicted as a short, pudgy, Italian plumber who `,
  //       `resides in the Mushroom Kingdom, his adventures generally center `,
  //       `upon rescuing Princess Peach from the Koopa villain Bowser. His `,
  //       `younger brother and sidekick is Luigi.`,
  //     ].join('\n'),
  //   )

  //   traitsField.setText(
  //     [
  //       `Mario can use three basic three power-ups:`,
  //       `  • the Super Mushroom, which causes Mario to grow larger`,
  //       `  • the Fire Flower, which allows Mario to throw fireballs`,
  //       `  • the Starman, which gives Mario temporary invincibility`,
  //     ].join('\n'),
  //   )

  //   treasureField.setText(['• Gold coins', '• Treasure chests'].join('\n'))

  const pdfBytes = await pdfDoc.save();
  const docUrl = URL.createObjectURL(
    new Blob([pdfBytes], { type: "application/pdf" })
  );
  console.log(docUrl);
  return docUrl;
};

export default fillPdfForm;
