import moment from 'moment'

moment.locale('en', {
  longDateFormat: {
    l: "YYYY-MM-DD",
  }
});

export default moment().format('l')