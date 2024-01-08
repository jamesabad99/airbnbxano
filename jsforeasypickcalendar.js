const DateTime = easepick.DateTime;

// REPLACE THIS WITH YOUR BLOCK DATES ARRAY FROM XANO
let blockDates = r.get_block_dates2.data;
const bookedDates = blockDates.map((d) => {
  if (d instanceof Array) {
    const start = new DateTime(d[0], "YYYY-MM-DD");
    const end = new DateTime(d[1], "YYYY-MM-DD");

    return [start, end];
  }

  return new DateTime(d, "YYYY-MM-DD");
});
const picker = new easepick.create({
  element: document.getElementById("datepicker"),
  calendars: 2,
  css: [
    "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css",
    "https://easepick.com/css/demo_hotelcal.css",
  ],
  setup(picker) {
    picker.on("select", (e) => {
      // Create a new Date object using the date string
      const dateCheckIn = e.detail.start;
      const dateCheckOut = e.detail.end;

      // Function to format the date into YYYY-MM-DD
      function formatDate(d) {
        let month = "" + (d.getMonth() + 1),
          day = "" + d.getDate(),
          year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
      }

      // Use the function to format the date
      const formattedDateCheckIn = formatDate(dateCheckIn);
      const formattedDateCheckOut = formatDate(dateCheckOut);

      //REPLACE THIS WITH YOUR WIZED VARIABLES
      v.checkInTutorial = formattedDateCheckIn;
      v.checkOutTutorial = formattedDateCheckOut;
    });
  },
  plugins: ["RangePlugin", "LockPlugin"],
  RangePlugin: {
    tooltipNumber(num) {
      return num - 1;
    },
    locale: {
      one: "night",
      other: "nights",
    },
  },
  LockPlugin: {
    minDate: new Date(),
    minDays: 2,
    inseparable: true,
    filter(date, picked) {
      if (picked.length === 1) {
        const incl = date.isBefore(picked[0]) ? "[)" : "(]";
        return (
          !picked[0].isSame(date, "day") && date.inArray(bookedDates, incl)
        );
      }

      return date.inArray(bookedDates, "[)");
    },
  },
});
