
$(document).ready(
  function () {

    function handleFileSelect(evt) {
      var files = evt.target.files; // FileList object

      var f = files[0];
      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload =
        (
          function (theFile) {
            return function (e) {

              // update file stats element
              // $("#file_input_stats")
              //   .text(theFile.name)
              // ;

              cal_data = e.target.result;


              var vcalendar;
              var vevent;
              var iCalendarData = "";

              table_id =
                $('#table_id')
                  .DataTable(
                    {
                      select: 'multiple'
                    }
                  )
                ;

              var jcalData;
              var summary;

              jQuery.get("dings.ical", function (data) {

                // prepare data 
                iCalendarData = cal_data;
                jcalData = ICAL.parse(iCalendarData);
                vcalendar = new ICAL.Component(jcalData);
                vevent = vcalendar.getFirstSubcomponent('vevent');

                // get variables from data
                summary = vevent.getFirstPropertyValue('summary');
                start = vevent.getFirstPropertyValue('dtstart');
                end = vevent.getFirstPropertyValue('end');


                var summaries =
                  vcalendar
                    .getAllSubcomponents()
                    .map(function (x) { return x.getFirstPropertyValue("summary"); })
                  ;

                var starts =
                  vcalendar
                    .getAllSubcomponents()
                    .map(function (x) { return Date.parse(x.getFirstPropertyValue("dtstart")); })
                  ;

                var ends =
                  vcalendar
                    .getAllSubcomponents()
                    .map(function (x) { return Date.parse(x.getFirstPropertyValue("dtend")); })
                  ;

                // fill table with variables
                for (let index = 0; index < summaries.length; index++) {
                  const element = summaries[index];
                  if (element === null) {
                    // do nothing
                  } else {

                    var duration_ms = moment(ends[index]).diff(moment(starts[index]));
                    var d = moment.duration(duration_ms);
                    var s =
                      Math.floor(d.asHours()) +
                      moment.utc(duration_ms).format("h :mm min :ss sec")
                      ;
                    var duration =
                      Math.floor(d.asHours()) +
                      moment.utc(duration_ms).format("[h] mm[m] ss[s]")
                      ;

                    var start_date = (new Date(starts[index])).toISOString().slice(0, 10);
                    var start_time = (new Date(starts[index])).toISOString().slice(11, 19);
                    var end_date = (new Date(ends[index])).toISOString().slice(0, 10);
                    var end_time = (new Date(ends[index])).toISOString().slice(11, 19);

                    table_id.row.add(
                      [
                        summaries[index],
                        start_date,
                        start_time,
                        end_date,
                        end_time,
                        duration
                      ]
                    );
                  }
                }

                // draw table
                table_id.draw(false);
              });

            };
          }
        )(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);

    }

    document
      .getElementById('file_input_selector')
      .addEventListener('change', handleFileSelect, false);
  }
);

function calender_stats() {

  var datatable = $("#table_id").DataTable({ retrieve: true });
  var rows_selected_ids = datatable.rows({ selected: true })[0];
  if (rows_selected_ids.length === 0) {
    rows_selected_ids = datatable.rows()[0];
  }

  var s = 0;

  for (let index = 0; index < rows_selected_ids.length; index++) {
    const element = datatable.row(rows_selected_ids[index]).data();
    s += parseInt(element[5]) * 60 * 60;
    s += parseInt(element[5].replace(/^.*h/, "")) * 60;
    s += parseInt(element[5].replace(/^.*m/, ""));
  }

  var duration      = moment.duration(s, "seconds");
  var duration_text =  
    Math.floor(duration.asHours()) +
    moment.utc(duration).format("[h] mm[m] ss[s]")
  ;

  $("#statsline_stats").text(duration_text);

};
