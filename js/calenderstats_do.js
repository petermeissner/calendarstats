
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
              var span = document.createElement('span');
              span.innerHTML =
                [
                  '<div>',
                  escape(theFile.name),
                  '</div>',
                ].join('');
              document.getElementById('list').insertBefore(span, null);

              cal_data = e.target.result;


              var vcalendar;
              var vevent;
              var iCalendarData = "";

              var table = $('#table_id').DataTable();

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


                var summaries = vcalendar
                  .getAllSubcomponents()
                  .map(function (x) { return x.getFirstPropertyValue("summary"); })

                var starts = vcalendar
                  .getAllSubcomponents()
                  .map(function (x) { return Date.parse(x.getFirstPropertyValue("dtstart")); })

                var ends = vcalendar
                  .getAllSubcomponents()
                  .map(function (x) { return Date.parse(x.getFirstPropertyValue("dtend")); })

                // fill table with variables
                for (let index = 0; index < summaries.length; index++) {
                  const element = summaries[index];
                  if (element === null) {
                    // do nothing
                  } else {
                    table.row.add(
                      [
                        summaries[index],
                        starts[index],
                        ends[index],
                        (ends[index] - starts[index]) / 60000
                      ]
                    );
                  }
                }

                // draw table
                table.draw(false);
              });

            };
          }
        )(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);

    }

    document.getElementById('files').addEventListener('change', handleFileSelect, false);





  }
);

