/**
 * Function to get date string of last day of last month
 * 
 */
function last_month_end(){
  const today = new Date();
  const last_day_last_month = new Date(today.setMonth(today.getMonth(), 0));
  return String(last_day_last_month.toISOString()).substring(0,10);
}

function last_month_start(){
  var today = new Date();
  const last_day_last_month = new Date(today.setMonth(today.getMonth()-1, 1));
  return String(last_day_last_month.toISOString()).substring(0,10);
}
