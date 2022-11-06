const path = require('path');

const initHbsHelpers = (hbs) => {
  const viewPath = path.join(__dirname, '../views/partials');
  hbs.registerPartials(viewPath);
  hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
  });
  hbs.registerHelper('ifNotEquals', function (arg1, arg2, options) {
    return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
  });
  hbs.registerHelper('splitDate', function (title) {
    // convert date to ISO format
    const date = new Date(title).toISOString();
    // split date and time
    const [dateOnly,] = date.split('T');
    // return date only
    console.log(dateOnly);
    return dateOnly;
  });
  // convert date to javascript date in yyyy-mm-dd format
  hbs.registerHelper('date', function (date) {
    // convert date to ISO format
    date = new Date(date).toISOString();
    var t = date.toString().split("05");
    var d = new Date(t[0]);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate();
    return year + "-" + month + "-" + day;
  });
  // subtract two numbers
  hbs.registerHelper('subtract', function (a, b) {
    a = parseInt(a);
    b = parseInt(b);
    return a - b;
  });
}

module.exports = initHbsHelpers;