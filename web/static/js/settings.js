/* Set up the necessary arrays */
var streams = [];
var zones = [];
var groups = [];

/* updateSettings clears out the previous API information and shows the current state */
function updateSettings() {
  $("#settings-tab-inputs-stream-title").text("Select a stream");
  $("#settings-tab-inputs-stream-selection").empty();
  $("#settings-tab-inputs-config").html("");
  $("#settings-tab-zones-title").text("Select a zone");
  $("#settings-tab-zones-selection").empty();
  $("#settings-tab-zones-config").html("");
  $("#settings-tab-groups-title").text("Select a group");
  $("#settings-tab-groups-selection").empty();
  $("#settings-tab-groups-config").html("");
  $.get("/api", function(data) {
    $.each(data.sources, function(k, v) {
      streams[v.id] = v;
      $("#settings-tab-inputs-stream-selection").append(
        '<li class="list-group-item list-group-item-action list-group-item-dark stream" style="vertical-align: bottom;" data-id="' + v.id + '">' +
        v.name +
        ' <span style="float:right;font-size:0.8rem;color:navy;line-height:25px;vertical-align: bottom;">' + `rca ${v.id+1}` + '</span>'
      );
    });
    $.each(data.streams, function(k, v) {
      streams[v.id] = v;
      $("#settings-tab-inputs-stream-selection").append(
        '<li class="list-group-item list-group-item-action list-group-item-dark stream" style="vertical-align: bottom;" data-id="' + v.id + '">' +
        v.name +
        ' <span style="float:right;font-size:0.8rem;color:navy;line-height:25px;vertical-align: bottom;">' + v.type + '</span>'
      );
    });
    $.each(data.zones, function(k, v) {
      zones[v.id] = v;
      $("#settings-tab-zones-selection").append(
        '<li class="list-group-item list-group-item-action list-group-item-dark zone-config" style="vertical-align: bottom;" data-id="' + v.id + '">' +
        v.name +
        ' <span style="float:right;font-size:0.8rem;color:navy;line-height:25px;vertical-align: bottom;">' + (v.disabled ? 'disabled' : '') + '</span>'
      );
    });
    $.each(data.groups, function(k, v) {
      groups[v.id] = v;
      $("#settings-tab-groups-selection").append(
        '<li class="list-group-item list-group-item-action list-group-item-dark group-config" style="vertical-align: bottom;" data-id="' + v.id + '">' +
        v.name
      );
    });
  });
};

/* On page load, get list of current streams */
$(function() {

  /* Disable enter key from submitting form, unless search on inetradio */
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      if (event.target.id == 'inetradio-search-name-txt') { // Intercept enter key for inetradio search
        $("#inetradio-search-name-btn").trigger('click');
      }

      event.preventDefault();
      return false;
    }
  });

  /* Show new stream options */
  $("#settings-tab-inputs-new-stream").click(function(){
    $("#settings-tab-inputs-stream-selection li").removeClass('active'); // De-select "active" stream on the left menu if had been selected
    $(this).addClass('active');
    $("#settings-tab-inputs-stream-title").text("Add a new stream to AmpliPi");
    var html = `
      <form id="settings-tab-inputs-new-stream-form">

        <div id="fmradio_warning" class="form-group addl_settings" style="color: yellow; display:none;">
          An extra USB dongle is needed to support FM Radio see <a href="https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/">RTL SDR</a>
        </div>

        <div class="form-group">
          <label for="new_stream_type">Stream Type</label>
          <select class="form-control" name="type" id="new_stream_type" data-required="true">
            <option value="0">- Select a Stream Type -</option>
            <option value="airplay">AirPlay Device</option>
            <option value="dlna">DLNA</option>
            <option value="fmradio">FM Radio Station</option>
            <option value="internetradio">Internet Radio Station</option>
            <option value="pandora">Pandora Station</option>
            <option value="plexamp">Plexamp</option>
            <option value="spotify">Spotify Device</option>
          </select>
        </div>
        <div class="form-group" id="streamNameDiv">
          <label for="name">Stream Name</label>
          <input type="text" class="form-control" name="name" id="str_name" aria-describedby="nameHelp" data-required="true">
          <small id="nameHelp" class="form-text text-muted">This name can be anything - it will be used to select this stream from the source selection dropdown</small>
        </div>

        <div id="pandora_settings" class="addl_settings" style="display:none;">
          <div class="form-group">
            <label for="new_pandora_user">Pandora Username</label>
            <input type="text" class="form-control" name="user" id="new_pandora_user" data-required="true">
          </div>
          <div class="form-group">
            <label for="new_pandora_password">Pandora Password</label>
            <input type="password" class="form-control" name="password" id="new_pandora_password" data-required="true">
          </div>
          <div class="form-group">
            <label for="new_pandora_station">Pandora Station ID</label>
            <input type="text" class="form-control" name="station" id="new_pandora_station" aria-describedby="stationHelp" data-required="true">
            <small id="stationHelp" class="form-text text-muted">Station ID is the numeric section of a Pandora station link. Example: ID = <b>4610303469018478727</b> from https://www.pandora.com/station/play/<b>4610303469018478727</b></small>
          </div>
        </div>

        <div id="internetradio_settings" class="addl_settings" style="display:none;">
          <ul class="nav nav-tabs" id="inetradioTab" role="tablist" style="margin-top:4px;">
            <li class="nav-item" role="presentation">
              <a class="nav-link active" href="#inetradio-search-name" id="inetradio-search-name-tab" data-toggle="tab" role="tab" aria-controls="inetradio-search-name" aria-selected="true">Search for Stations</a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" href="#inetradio-manual" id="inetradio-manual-tab" data-toggle="tab" role="tab" aria-controls="inetradio-manual" aria-selected="false">Manually Add Station</a>
            </li>
          </ul>

          <div class="tab-content" id="inetradioTabContent" style="margin-top:15px;">
            <div class="tab-pane fade show active" id="inetradio-search-name" role="tabpanel" aria-labelledby="inetradio-search-name-tab">
              <div class="form-group">
                <label for="inetradio-search-name-txt">Search by Station Name</label>
                <input type="text" class="form-control" name="inetradio-search-name-txt" id="inetradio-search-name-txt" data-required="true">
              </div>

              <button type="button" class="btn btn-secondary" id="inetradio-search-name-btn">Search Stations</button>

              <div id="inetradio-searchNameResults" style="margin-top:15px;"></div>

            </div>
            <div class="tab-pane fade" id="inetradio-manual" role="tabpanel" aria-labelledby="inetradio-manual-tab">
              <div class="form-group">
                <label for="url">Station Audio URL</label>
                <input type="text" class="form-control" name="url" id="url" aria-describedby="urlHelp" data-required="true">
                <small id="urlHelp" class="form-text text-muted">Audio URL must be supported by <a href="https://www.videolan.org/" target="_blank">VLC</a>.</small>
              </div>
              <div class="form-group">
                <label for="logo">Station Logo</label>
                <input type="text" class="form-control" name="logo">
              </div>

            </div>
          </div>
        </div>

        <div id="fmradio_settings" class="addl_settings" style="display:none;">
          <div class="form-group">
            <label for="new_fmradio_freq">FM Frequency</label>
            <input type="text" class="form-control" name="freq" id="new_fmradio_freq" aria-describedby="freqHelp" data-required="true">
            <small id="freqHelp" class="form-text text-muted">Enter an FM frequency 87.5 to 107.9. Requires an RTL-SDR compatible USB dongle.</small>
          </div>
          <div class="form-group">
            <label for="new_fmradio_logo">Station Logo</label>
            <input type="text" class="form-control" name="logo" id="new_fmradio_logo" aria-describedby="logoHelp">
            <small id="logoHelp" class="form-text text-muted">Default built-in logo is: static/imgs/fmradio.png</small>
          </div>
        </div>

        <div id="plexamp_settings" class="addl_settings" style="display:none;">
          <div class="form-group">
            <small id="plexHelp" class="form-text" style="color: #dee2e6">Click the <b>Request Authentication</b> button to open a Plex authorization page. Signing into Plex will generate a UUID and Token, shown below</small>
          </div>
          <div class="form-group">
            <button type="button" class="btn btn-success" onclick="plexamp_create_stream();" id="plexamp-connect">Request Authentication</button>
            <button type="button" class="btn btn-warning" onclick="window.location.reload();" style="display: none" id="plexamp-reset">Reset</button>
          </div>
          <div class="form-group">
            <label for="new_plexamp_uuid">UUID</label>
            <input type="text" class="form-control" name="client_id" id="new_plexamp_uuid" style="background-color: #adb5bd;" value="" data-required="true" readonly>
          </div>
          <div class="form-group">
            <label for="new_plexamp_token">Authentication Token</label>
            <input type="text" class="form-control" name="token" id="new_plexamp_token" style="background-color: #adb5bd;" value="" data-required="true" readonly>
          </div>
        </div>

        <button type="submit" class="btn btn-secondary" aria-describedby="submitHelp" id="addStreamButton">Add Stream</button>
        <small id="submitHelp" class="form-text text-muted"></small>
      </form>
      `;
    $("#settings-tab-inputs-config").html(html);
  });

  /* Show selected stream settings */
  $("#settings-tab-inputs-stream-selection").on("click", ".stream", function() {
    $('#settings-tab-inputs-stream-selection li').removeClass('active');
    $("#settings-tab-inputs-new-stream").removeClass('active');
    $(this).addClass('active');
    var s = streams[$(this).data("id")];
    console.log(s)
    var stream_type = s.type ? s.type : `rca ${s.id+1}`

    $("#settings-tab-inputs-stream-title").text(s.name + " (" + stream_type + ")");
    var html = `
      <input type="hidden" id="edit-sid" name="id" value="${s.id}">
      <form id="editStreamForm">
      `;

      if (s.type == "fmradio") {
        html += `
        <div class="form-group" style="color: yellow">
          An extra USB dongle is needed to support FM Radio see <a href="https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/" target="_blank">RTL SDR</a>
        </div>
        `;
      }

      html += `
        <div class="form-group">
          <label for="stream_name">Stream Name</label>
          <input type="text" class="form-control" name="name" id="stream_name" value="${s.name}" aria-describedby="nameHelp" data-required="true">
          <small id="nameHelp" class="form-text text-muted">This name can be anything - it will be used to select this stream from the source selection dropdown</small>
        </div>
      `;

      if (s.type == "pandora") {
        html += `
        <div class="form-group">
          <label for="pandora_user">Pandora Username</label>
          <input type="text" class="form-control" name="user" id="pandora_user" value="${s.user}" data-required="true">
        </div>
        <div class="form-group">
          <label for="pandora_password">Pandora Password</label>
          <input type="password" class="form-control" name="password" id="pandora_password" value="${s.password}" data-required="true">
        </div>
        <div class="form-group">
          <label for="pandora_station">Pandora Station ID</label>
          <input type="text" class="form-control" name="station" id="pandora_station" value="${s.station}" aria-describedby="stationHelp" data-required="true">
          <small id="stationHelp" class="form-text text-muted">Station ID is the numeric section of a Pandora station link. Example: ID = <b>4610303469018478727</b> from https://www.pandora.com/station/play/<b>4610303469018478727</b></small>
        </div>
        `;
      }

      if (s.type == "internetradio") {
        html += `
        <div class="form-group">
          <label for="internetradio_url">Station Audio URL</label>
          <input type="text" class="form-control" name="url" id="internetradio_url" value="${s.url}" aria-describedby="urlHelp" data-required="true">
          <small id="urlHelp" class="form-text text-muted">Audio URL must be supported by <a href="https://www.videolan.org/" target="_blank">VLC</a>.</small>
        </div>
        <div class="form-group">
          <label for="internetradio_logo">Station Logo</label>
          <input type="text" class="form-control" name="logo" id="internetradio_logo" value="${s.logo}">
        </div>
        `;
      }

      if (s.type == "fmradio") {
        html += `
        <div class="form-group">
          <label for="fmradio_freq">FM Frequency</label>
          <input type="text" class="form-control" name="freq" id="fmradio_freq" value="${s.freq}" aria-describedby="freqHelp" data-required="true">
          <small id="freqHelp" class="form-text text-muted">Enter an FM frequency 87.5 to 107.9. Requires an RTL-SDR compatible USB dongle.</small>
        </div>
        <div class="form-group">
          <label for="fmradio_logo">Station Logo</label>XS
          <input type="text" class="form-control" name="logo" id="fmradio_logo" value="${s.logo}" aria-describedby="logoHelp">
          <small id="logoHelp" class="form-text text-muted">Default built-in logo is: static/imgs/fmradio.png</small>
        </div>
        `;
      }

      if (s.type == "plexamp") {
        html += `
        <div class="form-group">
          <small id="plexHelp" class="form-text" style="color: #dee2e6">Click the <b>Request Authentication</b> button to open a Plex authorization page. Signing into Plex will generate a UUID and Token, shown below</small>
        </div>
        <div class="form-group">
          <button class="btn btn-success" onclick="plexamp_create_stream();" id="plexamp-connect">Request Authentication</button>
          <button class="btn btn-warning" onclick="window.location.reload();"style="display: none" id="plexamp-reset">Reset</button>
        </div>
        <div class="form-group">
          <label for="plexamp_uuid">UUID</label>
          <input type="text" class="form-control" name="client_id" id="plexamp_uuid" style="background-color: #adb5bd;" value="${s.client_id}" data-required="true" readonly>
        </div>
        <div class="form-group">
          <label for="plexamp_token">Authentication Token</label>
          <input type="text" class="form-control" name="token" id="plexamp_token" style="background-color: #adb5bd;" value="${s.token}" data-required="true" readonly>
        </div>
        `;
      }

      if (s.type == null) {
        del = '<button type="button" class="btn btn-danger" style="display:none" id="delete" data-id="${s.id}">Delete</button>'
      } else {
        del = '<button type="button" class="btn btn-danger" id="delete" data-id="${s.id}">Delete</button>'
      }

      html += `
        <button type="submit" class="btn btn-secondary" aria-describedby="submitHelp">Save Changes</button>
        ${del}
        <small id="submitHelp" class="form-text text-muted"></small>
      </form>
      `;
    $("#settings-tab-inputs-config").html(html);
  });

  /* Show selected stream settings */
  $("#settings-tab-inputs-config").on("click", "#new_stream_type", function() {
    $(".addl_settings").hide(); // Hide all additional settings
    $("#addStreamButton").show(); // Make sure this is showing (inetradio may hide it)
    $("#streamNameDiv").show(); // Make sure this is showing (inetradio may hide it)
    if ($(this).val() == "pandora") { $("#pandora_settings").show(); }
    else if ($(this).val() == "internetradio") { $("#internetradio_settings").show(); $("#addStreamButton").hide(); $("#streamNameDiv").hide(); }
    else if ($(this).val() == "fmradio") { $("#fmradio_settings").show(); $("#fmradio_warning").show(); }
    else if ($(this).val() == "plexamp") { $("#plexamp_settings").show(); }

  });

  /* Hide some settings on the internet radio page when searching for stations */
  $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    e.target // newly activated tab
    if (e.target.id == 'inetradio-search-name-tab' || e.target.id == 'inetradio-search-loc-tab') {
      // Hide Stream Name field and Add Stream button
      $("#addStreamButton").hide();
      $("#streamNameDiv").hide();
    }
    else {
      // Show Stream Name field and Add Stream button
      $("#addStreamButton").show();
      $("#streamNameDiv").show();
    }
  })

  /* Search for inetradio stations */
  $(document).on('click', '#inetradio-search-name-btn', function () {
    console.log('Searching for station by name: ' + $("#inetradio-search-name-txt").val());
    $.ajax({
      type: "GET",
      url: 'https://de1.api.radio-browser.info/json/stations/byname/' + $("#inetradio-search-name-txt").val(),
      contentType: "application/json",
      success: function(data) {
        $("#inetradio-searchNameResults").html("<h3>Search Results</h3>");
        var details = '';
        var numResults = 0;
        $.each(data, function(index, value) {
          ++numResults;
          if (value.bitrate && value.codec) { details = '(' + value.bitrate + 'kbps ' + value.codec + ')'; }
          $('#inetradio-searchNameResults').append(
            '<div style="position: relative; padding:6px;"><b><a href="' +
            value.homepage +
            '" target="_blank" title="Station Homepage">' +
            value.name +
            '</a></b> ' +
            details +
            '<a href="https://www.radio-browser.info/history/' +
            value.stationuuid +
            '" target="_blank" class="btn btn-info btn-sm float-right" role="button" style="position: absolute;right: 0;">More Info</a>' +
            '<a href="#" class="btn btn-success btn-sm float-right addStation" data-stationname="' +
            value.name.toString().replace('"', '\\"') +
            '" data-stationurl="' +
            value.url_resolved.toString().replace('"', '\\"') +
            '" data-stationlogo="' +
            value.favicon.toString().replace('"', '\\"') +
            '" role="button" style="position: absolute;right: 90px;">Add Station</button></div>'
          );
        });
        if (!numResults) { $('#inetradio-searchNameResults').append("No stations found."); }
      }
    });
  });

  /* Add an inetradio station from search screen */
  $(document).on('click', '.addStation', function () {
    var name = $(this).data('stationname');
    var url = $(this).data('stationurl');
    var logo = $(this).data('stationlogo');
    var formData = {logo: logo, name: name, type: "internetradio", url: url};

    $.ajax({
      type: "POST",
      url: '/api/stream',
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: updateSettings
    });

    return false;
  });

  /* Add New Stream and Reload Page */
  $("#settings-tab-inputs-config").on("submit", "#settings-tab-inputs-new-stream-form", function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    var $form = $("#settings-tab-inputs-new-stream-form");
    var validation = checkFormData($("#settings-tab-inputs-new-stream-form :input"))
    console.log(validation);
    if (!validation) { return; }

    var formData = getFormData($form);

    $.ajax({
      type: "POST",
      url: '/api/stream',
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: updateSettings
    });
  });


  /* Save stream changes and reload page */
  $("#settings-tab-inputs-config").on("submit", "#editStreamForm", function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    var $form = $("#editStreamForm");
    var validation = checkFormData($("#editStreamForm :input"));
    if (!validation) { return; }

    var formData = getFormData($form);
    var s = streams[document.getElementById('edit-sid').value];
    console.log(s)
    if (s.type == null) {
      var nurl = '/api/sources/'
    } else {
      var nurl = '/api/streams/'
    }

    $.ajax({
      type: "PATCH",
      url: nurl + $("#edit-sid").val(),
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: updateSettings
    });
  });


  /* Delete stream and reload stream list and settings */
  $("#settings-tab-inputs-config").on("click", "#delete", function() {
    $.ajax({
      url: '/api/streams/' + document.getElementById("edit-sid").value,
      type: 'DELETE',
      success: updateSettings
    });
  });

  /* Show selected zone settings */
  $("#settings-tab-zones-selection").on("click", ".zone-config", function() {
    $('#settings-tab-zones-selection li').removeClass('active');
    $(this).addClass('active');
    var z = zones[$(this).data("id")];
    console.log(z)

    $("#settings-tab-zones-title").text(z.name);

    /* TODO: min and max volumes should be taken from models.py, can we add this to the API? */
    /* The checkbox here use a hidden input to send the value of false by default.
     * The actual checkbox will either send nothing, or send true which overrides the false. */
    var html = `
      <input type="hidden" id="edit-zid" name="id" value="${z.id}">
      <form id="editZoneForm">
        <div class="form-group">
          <label for="zoneName">Zone Name</label>
          <input type="text" class="form-control" name="name" id="zoneName" value="${z.name}" data-required="true">
        </div>
        <div class="form-group">
          <label for="volMinDb">Minimum Volume</label>
          <input type="number" class="form-control" name="vol_min" id="volMinDb" value="${z.vol_min}" min="-80" max="0" aria-describedby="minVolHelp" data-required="true">
          <small id="minVolHelp" class="form-text text-muted">-80 to 0 dB, default -80. Must be at least 20 dB lower than max volume.</small>
        </div>
        <div class="form-group">
          <label for="volMaxDb">Maximum Volume</label>
          <input type="number" class="form-control" name="vol_max" id="volMaxDb" value="${z.vol_max}" min="-80" max="0" aria-describedby="maxVolHelp" data-required="true">
          <small id="maxVolHelp" class="form-text text-muted">-80 to 0 dB, default 0. Must be at least 20 dB higher than min volume.</small>
        </div>
        <div class="form-group">
          <input type="hidden" value="false" name="disabled">
          <input type="checkbox" id="disabledState" name="disabled" value="true"${z.disabled ? " checked" : ""} aria-describedby="disHelp">
          <label for="disabledState">Disabled</label>
          <small id="disHelp" class="form-text text-muted">Disabling a zone removes its mute and volume controls. A zone should be disabled if it isn't going to be used, or has no speakers connected to it</small>
        </div>
      `;

      html += `
        <button type="submit" class="btn btn-secondary" aria-describedby="submitHelp">Save Changes</button>
        <small id="submitHelp" class="form-text text-muted"></small>
      </form>
      `;
    $("#settings-tab-zones-config").html(html);
  });

  /* Save zone changes and reload page */
  $("#settings-tab-zones-config").on("submit", "#editZoneForm", function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    var $form = $("#editZoneForm");
    var validation = checkFormData($("#editZoneForm :input"));
    if (!validation) { return; }

    var formData = getFormData($form);
    var z = zones[document.getElementById('edit-zid').value];
    console.log(z)

    $.ajax({
      type: "PATCH",
      url: '/api/zones/' + $("#edit-zid").val(),
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: updateSettings
    });
  });

  /* Show new group options */
  $("#settings-tab-groups-new-group").click(function(){
    $("#settings-tab-groups-selection li").removeClass('active'); // De-select "active" group on the left menu if had been selected
    $(this).addClass('active');
    $("#settings-tab-groups-title").text("Add a new group to AmpliPi");
    var zone_html = ``;

    for (const zone in zones) {
      zone_html += `
      <option value="${zone}">${zones[zone].name}</option>
      `;
    };

    var html = `
      <form id="settings-tab-groups-new-group-form">
        <div class="form-group">
          <label for="new_group_name">Group Name</label>
          <input type="text" class="form-control" name="name" id="new_group_name" data-required="true">
        </div>
        <div class="form-group">
          <select class="selectpicker" id="zone-picker" multiple>
            ${zone_html}
          </select>
        </div>
        <button type="submit" class="btn btn-secondary" aria-describedby="submitHelp">Add Group</button>
        <small id="submitHelp" class="form-text text-muted"></small>
      </form>
      `;
    $("#settings-tab-groups-config").html(html);
    /* Initialize selectpicker */
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
      $('#zone-picker').selectpicker('mobile');
    } else {
      $('#zone-picker').selectpicker({});
    }
  });

  /* Show selected group settings */
  $("#settings-tab-groups-selection").on("click", ".group-config", function() {
    $('#settings-tab-groups-selection li').removeClass('active');
    $("#settings-tab-groups-new-group").removeClass('active');
    $(this).addClass('active');
    var g = groups[$(this).data("id")];
    console.log(g)
    $("#settings-tab-groups-title").text(g.name);
    var zone_html = ``;

    for (const zone in zones) {
      const incl = g.zones.includes(parseInt(zone));
      zone_html += `
      <option value="${zone}"${incl ? " selected" : ""}>${zones[zone].name}</option>
      `;
    };

    var html = `
      <input type="hidden" id="edit-gid" name="id" value="${g.id}">
      <form id="editGroupForm">
        <div class="form-group">
          <label for="group_name">Group Name</label>
          <input type="text" class="form-control" name="name" id="group_name" value="${g.name}" data-required="true">
        </div>
        <div class="form-group">
          <select class="selectpicker" id="zone-picker" multiple>
            ${zone_html}
          </select>
        </div>
        <button type="submit" class="btn btn-secondary" aria-describedby="submitHelp">Save Changes</button>
        <button type="button" class="btn btn-danger" id="delete" data-id="${g.id}">Delete</button>
        <small id="submitHelp" class="form-text text-muted"></small>
      </form>
      `;
    $("#settings-tab-groups-config").html(html);
    /* Initialize selectpicker */
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
      $('#zone-picker').selectpicker('mobile');
    } else {
      $('#zone-picker').selectpicker({});
    }
  });

  /* Add New Group and Reload Page */
  $("#settings-tab-groups-config").on("submit", "#settings-tab-groups-new-group-form", function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    var $form = $("#settings-tab-groups-new-group-form");
    var validation = checkFormData($("#settings-tab-groups-new-group-form :input"))
    console.log(validation);
    if (!validation) { return; }

    var formData = getGroupData($form);
    console.log(formData);

    $.ajax({
      type: "POST",
      url: '/api/group',
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: updateSettings
    });
  });


  /* Save group changes and reload page */
  $("#settings-tab-groups-config").on("submit", "#editGroupForm", function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    var $form = $("#editGroupForm");
    var validation = checkFormData($("#editGroupForm :input"));
    if (!validation) { return; }

    var formData = getGroupData($form);
    var g = groups[document.getElementById('edit-gid').value];
    console.log(g)

    $.ajax({
      type: "PATCH",
      url: '/api/groups/' + $("#edit-gid").val(),
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: updateSettings
    });
  });


  /* Delete stream and reload stream list and settings */
  $("#settings-tab-groups-config").on("click", "#delete", function() {
    $.ajax({
      url: '/api/groups/' + document.getElementById("edit-gid").value,
      type: 'DELETE',
      success: updateSettings
    });
  });

  /* Make sure all required field are filled */
  function checkFormData($form) {
    var isValid = true;
    var sub_text = document.getElementById('submitHelp');
    sub_text.textContent = "";
    $form.each(function() {console.log($(this).data("required"));
      if ($(this).data("required") == true && $(this).val() === '' && $(this).is(':visible')) {
        isValid = false;
        sub_text.textContent = "Please fill out all required fields.";
        $(this).addClass('is-invalid');
      }
    });
    return isValid;
  }

  /* Return form data in AmpliPi's JSON format */
  function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
  }

  /* Unique form parsing for Groups */
  function getGroupData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};
    var zone_array = [];
    const zone_sel = document.getElementById('zone-picker');
    for (const option of document.querySelectorAll('#zone-picker option')) {
      const val = Number.parseInt(option.value);
      if (option.selected) {
        zone_array.push(val);
      }
    }

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
        indexed_array['zones'] = zone_array;
    });

    return indexed_array;
  }
});

/* Plexamp Authentication Functions */
async function plex_pin_req() {
  // Request a Plex pin to use for interacting with the Plex API
  document.getElementById('plexamp-connect').textContent = "Sending request...";
  let myuuid = uuidv4(); // UUID used as the 'clientIdentifier' for Plexamp requests/devices
  let details = { }
  let response = await fetch('https://plex.tv/api/v2/pins', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: "strong=true&X-Plex-Product=AmpliPi&X-Plex-Client-Identifier=" + myuuid
  }); // The actual pin request is sent. response holds the pin, pin code, and our UUID.
  response.json()
  .then(function(response){ // Make URL for the Plex Account Login
    const purl = `https://app.plex.tv/auth#?clientID=${response.clientIdentifier}&code=${response.code}&context%5Bdevice%5D%5Bproduct%5D=AmpliPi`;
    details.id = response.id; // The actual PIN
    details.code = response.code; // A code associated with the PIN
    details.uuid = response.clientIdentifier; // Our UUID associated with the PIN and authToken
    details.authToken = null; // Will eventually hold a token from plex_token_ret on a successful sign-in
    console.log(details);
    window.open(purl, "_blank"); // Open 'purl' in a new tab in the current browser window
  });
  return details; // Pin, code, UUID, and authToken are used in the other functions
}

async function plex_token_ret(details) {
  // Attempt to retrieve the plex token (this will return 'null' until the user enters their Plex account details)
  // NOTE: this token will only work for plexamp if the user has a Plex Pass subscription
  document.getElementById('plexamp-connect').textContent = "Awaiting Plex sign-in...";
  let response = await fetch('https://plex.tv/api/v2/pins/'+details.id, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'code': details.code,
      'X-Plex-Client-Identifier': details.uuid
    },
  }); // Information related to our PIN was requested. Parse that info to see if we've authenticated yet
  response.json().then(function(response){
    console.log("Token: " + response.authToken);
    details.authToken = response.authToken;
    console.log("Time remaining: " + response.expiresIn);
    details.expiresIn = response.expiresIn;
  });
  return details;
}

async function plex_stream(details) {
  // Create Plexamp stream using AmpliPi's API
  var req = {
    "name": details.name,
    "client_id": details.uuid,
    "token": details.authToken,
    "type": "plexamp"
  } // POST a new stream to the AmpliPi API using the newly authenticated credentials
  sendRequest('/stream', 'POST', req);
  console.log(`Creating stream with these parameters: name = ${req.name}, UUID = ${req.client_id}, and token = ${req.token}`);
}

function sleepjs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms)); // JavaScript sleep function
}

async function plexamp_create_stream() {
  // Connect to Plex's API and add a Plexamp stream to AmpliPi
  var connect_button = document.getElementById('plexamp-connect');
  var reset_button = document.getElementById('plexamp-reset');
  var msg_box1 = document.getElementById('plexHelp');
  var msg_box2 = document.getElementById('submitHelp');
  var uuid_text = document.getElementById('client_id');
  var auth_text = document.getElementById('token');
  connect_button.disabled = true;
  let details = await plex_pin_req(); // Request a pin
  await sleepjs(2000); // Wait for info to propagate over
  reset_button.style.display = "inline-block";
  msg_box1.style.display = "none";

  do {
    let details2 = await plex_token_ret(details); // Retrieve our token
    await sleepjs(2000); // poll the plex servers slowly
    if (details2.expiresIn == null){
      msg_box1.textContent = "Timed out while waiting for response from Plex";
      msg_box1.style.color = "yellow";
      msg_box1.style.display = "block";
      msg_box1.style.alignSelf = "left";
      break; // Break when you run out of time (30 minutes, set by Plex)
    }
    details = details2; // Update authToken state and time until expiration
  } while (details.authToken == null); // "== null" should also check for undefined
  if (details.authToken){
    connect_button.style.display = "none";
    reset_button.style.display = "none";
    auth_text.value = `${details.authToken}`;
    uuid_text.value = `${details.uuid}`;
    msg_box2.textContent = `Client_id and Token successfully generated!`;
    // plex_stream(details); // Create a Plexamp stream using the API!
  }
}
