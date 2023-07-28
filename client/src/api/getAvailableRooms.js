import axios from "./xano";
var _ = require("lodash");

export const getAvailableRooms = async (
  currentAppointmentId,
  rangeStart,
  rangeEnd,
  authToken,
  controller
) => {
  try {
    const response = await axios.post(
      "/appointments_in_range",
      { range_start: rangeStart, range_end: rangeEnd },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        ...(controller && { signal: controller.signal }),
      }
    );
    const appointmentsInRange = response?.data;
    const otherAppointments = appointmentsInRange.filter(
      ({ id }) => id !== currentAppointmentId
    );
    const occupiedRooms = _.uniq(
      otherAppointments
        .filter(({ room }) => room !== "To be determined")
        .map(({ room }) => room)
    );
    const allRooms = [
      "Room A",
      "Room B",
      "Room C",
      "Room D",
      "Room E",
      "Room F",
      "Room G",
    ];
    const availableRooms = _.difference(allRooms, occupiedRooms);
    return availableRooms;
  } catch (err) {
    console.log(err.message);
  }
};