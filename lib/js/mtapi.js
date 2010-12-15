// Copyright 2010, MediaTemple, Inc.

var mtapi_client_version = "0.1";

// global
var mtapi_baseurl = '';
var mtapi_apiuri = '/api/v1';
var mtapi_apikey;
var mt_request_type = 'json';
var mt_request_timeout = 30000;
var mt_wrap_root = false;
var mt_pretty_print = false;
var DEBUG = false;

// service uris
var mtapi_services_uri = '/services'
var mtapi_service_ids_uri = '/services/ids'
var mtapi_service_uri = '/services/'
var mtapi_service_reboot_uri = '/services/{id}/reboot'
var mtapi_service_rootpw_uri = '/services/{id}/rootPassword'
var mtapi_service_pleskpw_uri = '/services/{id}/pleskPassword'
var mtapi_service_temp_disk_uri = '/services/{id}/disk/temp'
var mtapi_service_flush_firewall_uri = '/services/{id}/firewall/flush'

// stats
var mtapi_stats_base_uri = '/stats'
var mtapi_stats_warnings_uri = mtapi_stats_base_uri + "/warnings"
var mtapi_stats_warnings_thresholds_uri = mtapi_stats_base_uri + "/warnings/thresholds"
var mtapi_stats_5min_uri = mtapi_stats_base_uri + "/5min"
var mtapi_stats_15min_uri = mtapi_stats_base_uri + "/15min"
var mtapi_stats_30min_uri = mtapi_stats_base_uri + "/30min"
var mtapi_stats_1hour_uri = mtapi_stats_base_uri + "/1hour"

function MTAPI(baseurl, apikey) {
    if (!isEmpty(baseurl)) {
        mtapi_baseurl = baseurl;
        if (DEBUG == 1) {
            console.log("MTAPI(): using baseurl "+mtapi_baseurl);
        }
    } else {
        throw Error("MTAPI must be initialized with a base URL (ex. http://api.mediatemple.net)");
    }
    mtapi_apikey = apikey;

    var mtapi_client_version = "0.1";

    this.getServices = getServices;
    this.getServiceIds = getServiceIds;
    this.getService = getService;

    this.rebootService = rebootService;
    this.addTempDiskSpace = addTempDiskSpace;
    this.flushFirewall = flushFirewall;
    this.setRootPassword = setRootPassword;
    this.setPleskPassword = setPleskPassword;

    this.getCurrentStats = getCurrentStats;
    this.getRangeStats = getRangeStats;
    this.get5MinStats = get5MinStats;
    this.get15MinStats = get15MinStats;
    this.get30MinStats = get30MinStats;
    this.get1HourStats = get1HourStats;

    this.getWarnings = getWarnings;
    this.getWarningThresholds = getWarningThresholds;
}

function buildAPIQuery(uri) {
    var myURL = mtapi_baseurl + mtapi_apiuri + uri;
    myURL += '?apikey=' + mtapi_apikey;
    myURL += '&prettyPrint=' + mt_pretty_print;
    myURL += '&wrapRoot=' + mt_wrap_root;
    return myURL;
}

function getServiceIds(success, failure) {
  try {
    var url = buildAPIQuery(mtapi_service_ids_uri);
    if (DEBUG == 1) {
        console.log("getServiceIds(): requesting service ids from "+url);
    }

    $.ajax({
      url: url,
      async: true,
      cache: false,
      dataType: mt_request_type,
      timeout: mt_request_timeout,
      success: function(json, statusText, request) {
        if (DEBUG == 1) {
            console.log("getServiceIds(): current: "+$.dump(json)+"\n");
        }
        if (isDefined(success)) {
            if (DEBUG == 1) {
                console.log("getServiceIds(): executing success callback");
            }
            success(json);
        }
      },
      error: function(request, textStatus, errorThrown) {
        //alert("error: "+textStatus+" errorThrown: "+errorThrown+" response: "+request.responseText);
        if (DEBUG == 1) {
            console.log("getServiceIds(): response = "+request.responseText+", error: "+errorThrown+"\n");
        }
        if (isDefined(failure)) {
            if (DEBUG == 1) {
                console.log("getServiceIds(): executing failure callback");
            }
            try {
                var response = $.parseJSON(request.responseText);
                failure(response);
            } catch (ex) {
                // just pass the response text back since we couldn't get a json response object
                failure(request.responseText);
            }
        }
      }
    });
  } catch (err) {
    try {
        if (DEBUG == 1) {
            console.log("getServiceIds(): error: "+err);
        }
    } catch (err2) { }
  }
}

function getServices(success, failure) {
  try {
    var url = buildAPIQuery(mtapi_services_uri);
    if (DEBUG == 1) {
        console.log("getServices(): requesting services from "+url);
    }

    $.ajax({
      url: url,
      async: true,
      cache: false,
      dataType: mt_request_type,
      timeout: mt_request_timeout,
      success: function(json, statusText, request) {
        if (DEBUG == 1) {
            console.log("getServices(): current: "+$.dump(json)+"\n");
        }
        if (isDefined(success)) {
            if (DEBUG == 1) {
                console.log("getServices(): executing success callback");
            }
            success(json);
        }
      },
      error: function(request, textStatus, errorThrown) {
        //alert("error: "+textStatus+" errorThrown: "+errorThrown+" response: "+request.responseText);
        if (DEBUG == 1) {
            console.log("getServices(): response = "+request.responseText+", error: "+errorThrown+"\n");
        }
        if (isDefined(failure)) {
            if (DEBUG == 1) {
                console.log("getServices(): executing failure callback");
            }
            try {
                var response = $.parseJSON(request.responseText);
                failure(response);
            } catch (ex) {
                // just pass the response text back since we couldn't get a json response object
                failure(request.responseText);
            }
        }
      }
    });
  } catch (err) {
    try {
        if (DEBUG == 1) {
            console.log("getServices(): error: "+err);
        }
    } catch (err2) { }
  }
}

function isDefined(x) {
   return !isUndefined(x);
}

function getService(id, success, failure) {
  try {
    var url = buildAPIQuery(mtapi_service_uri+id);
    if (DEBUG == 1) {
        console.log("getService(): requesting service from "+url);
    }

    $.ajax({
      url: url,
      async: true,
      cache: false,
      dataType: mt_request_type,
      timeout: mt_request_timeout,
      success: function(json, statusText, request) {
        if (DEBUG == 1) {
            console.log("getService(): current: "+$.dump(json)+"\n");
        }
        if (isDefined(success)) {
            if (DEBUG == 1) {
                console.log("getService(): executing success callback");
            }
            success(json);
        }
      },
      error: function(request, textStatus, errorThrown) {
        //alert("error: "+textStatus+" errorThrown: "+errorThrown+" response: "+request.responseText);
        if (DEBUG == 1) {
            console.log("getService(): response = "+request.responseText+", error: "+errorThrown+"\n");
        }
        if (isDefined(failure)) {
            if (DEBUG == 1) {
                console.log("getService(): executing failure callback");
            }
            try {
                var response = $.parseJSON(request.responseText);
                failure(response);
            } catch (ex) {
                // just pass the response text back since we couldn't get a json response object
                failure(request.responseText);
            }
        }
      }
    });
  } catch (err) {
    try {
        if (DEBUG == 1) {
            console.log("getService(): error: "+err);
        }
    } catch (err2) { }
  }
}

function getCurrentStats(id, success, failure) {
    if (DEBUG == 1) {
        console.log("getCurrentStats(): requesting current stats");
    }
    getStats(id, null, null, null, success, failure);
}

function getRangeStats(id, start, end, success, failure) {
    if (DEBUG == 1) {
        console.log("getRangeStats(): requesting range stats");
    }
    getStats(id, start, end, null, success, failure);
}

function get5MinStats(id, success, failure) {
    getStats(id, null, null, "5min", success, failure);
}

function get15MinStats(id, success, failure) {
    getStats(id, null, null, "15min", success, failure);
}

function get30MinStats(id, success, failure) {
    getStats(id, null, null, "30min", success, failure);
}

function get1HourStats(id, success, failure) {
    getStats(id, null, null, "1hour", success, failure);
}

function getStats(id, start, end, predefined, success, failure) {
  try {
    if (isEmpty(id) || id == '') {
        if (isDefined(failure)) {
            if (DEBUG == 1) {
                console.log("getStats(): executing failure callback");
            }

            failure("A valid service id must be specified");
            return;
        }
    }
    var uri = mtapi_stats_base_uri+"/"+id;
    if (!isEmpty(predefined)) {
        uri += "/"+predefined;
    }
    var url = buildAPIQuery(uri);
    if (DEBUG == 1) {
        console.log("getStats(): requesting stats from "+url);
    }

    if (!isEmpty(start)) {
        url += "&start="+start;
    }
    if (!isEmpty(end)) {
        url += "&end="+end;
    }

    $.ajax({
      url: url,
      async: true,
      cache: false,
      dataType: mt_request_type,
      timeout: mt_request_timeout,
      success: function(json, statusText, request) {
        if (DEBUG == 1) {
            console.log("getStats(): current: "+$.dump(json)+"\n");
        }
        if (isDefined(success)) {
            if (DEBUG == 1) {
                console.log("getStats(): executing success callback");
            }
            success(json);
        }
      },
      error: function(request, textStatus, errorThrown) {
        //alert("error: "+textStatus+" errorThrown: "+errorThrown+" response: "+request.responseText);
        if (DEBUG == 1) {
            console.log("getStats(): response = "+request.responseText+", error: "+errorThrown+"\n");
        }
        if (isDefined(failure)) {
            if (DEBUG == 1) {
                console.log("getStats(): executing failure callback");
            }
            try {
                var response = $.parseJSON(request.responseText);
                failure(response);
            } catch (ex) {
                // just pass the response text back since we couldn't get a json response object
                failure(request.responseText);
            }
        }
      }
    });
  } catch (err) {
    try {
        if (DEBUG == 1) {
            console.log("getStats(): error: "+err);
        }
    } catch (err2) { }
  }
}

function getWarnings(success, failure) {
  try {
    var uri = mtapi_stats_warnings_uri;
    var url = buildAPIQuery(uri);
    if (DEBUG == 1) {
        console.log("getWarnings(): requesting warnings from "+url);
    }

    $.ajax({
      url: url,
      async: true,
      cache: false,
      dataType: mt_request_type,
      timeout: mt_request_timeout,
      success: function(json, statusText, request) {
        if (DEBUG == 1) {
            console.log("getWarnings(): current: "+$.dump(json)+"\n");
        }
        if (isDefined(success)) {
            if (DEBUG == 1) {
                console.log("getWarnings(): executing success callback");
            }
            success(json);
        }
      },
      error: function(request, textStatus, errorThrown) {
        //alert("error: "+textStatus+" errorThrown: "+errorThrown+" response: "+request.responseText);
        if (DEBUG == 1) {
            console.log("getWarnings(): response = "+request.responseText+", error: "+errorThrown+"\n");
        }
        if (isDefined(failure)) {
            if (DEBUG == 1) {
                console.log("getWarnings(): executing failure callback");
            }
            try {
                var response = $.parseJSON(request.responseText);
                failure(response);
            } catch (ex) {
                // just pass the response text back since we couldn't get a json response object
                failure(request.responseText);
            }
        }
      }
    });
  } catch (err) {
    try {
        if (DEBUG == 1) {
            console.log("getWarnings(): error: "+err);
        }
    } catch (err2) { }
  }
}

function getWarningThresholds(success, failure) {
  try {
    var uri = mtapi_stats_warnings_thresholds_uri;
    var url = buildAPIQuery(uri);
    if (DEBUG == 1) {
        console.log("getWarningThresholds(): requesting warning thresholds from "+url);
    }

    $.ajax({
      url: url,
      async: true,
      cache: false,
      dataType: mt_request_type,
      timeout: mt_request_timeout,
      success: function(json, statusText, request) {
        if (DEBUG == 1) {
            console.log("getWarningThresholds(): current: "+$.dump(json)+"\n");
        }
        if (isDefined(success)) {
            if (DEBUG == 1) {
                console.log("getWarningThresholds(): executing success callback");
            }
            success(json);
        }
      },
      error: function(request, textStatus, errorThrown) {
        //alert("error: "+textStatus+" errorThrown: "+errorThrown+" response: "+request.responseText);
        if (DEBUG == 1) {
            console.log("getWarningThresholds(): response = "+request.responseText+", error: "+errorThrown+"\n");
        }
        if (isDefined(failure)) {
            if (DEBUG == 1) {
                console.log("getWarningThresholds(): executing failure callback");
            }
            try {
                var response = $.parseJSON(request.responseText);
                failure(response);
            } catch (ex) {
                // just pass the response text back since we couldn't get a json response object
                failure(request.responseText);
            }
        }
      }
    });
  } catch (err) {
    try {
        if (DEBUG == 1) {
            console.log("getWarningThresholds(): error: "+err);
        }
    } catch (err2) { }
  }
}

function rebootService(id, success, failure) {
    if (DEBUG == 1) {
        console.log("rebootService(): requesting reboot");
    }
    makeServiceRequest("POST", mtapi_service_reboot_uri, id, null, success, failure);
}

function addTempDiskSpace(id, success, failure) {
    if (DEBUG == 1) {
        console.log("rebootService(): adding temp disk space");
    }
    makeServiceRequest("POST", mtapi_service_temp_disk_uri, id, null, success, failure);
}

function flushFirewall(id, success, failure) {
    if (DEBUG == 1) {
        console.log("rebootService(): flushing firewall");
    }
    makeServiceRequest("POST", mtapi_service_flush_firewall_uri, id, null, success, failure);
}

function setRootPassword(id, password, success, failure) {
    if (DEBUG == 1) {
        console.log("setRootPassword(): setting root password");
    }
    var data = '{"password": "' + password.replace(/"/, '\\"') + '"}';
    makeServiceRequest("PUT", mtapi_service_rootpw_uri, id, data, success, failure);
}

function setPleskPassword(id, password, success, failure) {
    if (DEBUG == 1) {
        console.log("setPleskPassword(): setting plesk password");
    }
    var data = '{"password": "' + password.replace(/"/, '\\"') + '"}';
    makeServiceRequest("PUT", mtapi_service_pleskpw_uri, id, data, success, failure);
}

function makeServiceRequest(type, serviceURI, id, data, success, failure) {
  try {
    var uri = serviceURI.replace(/{id}/, id);
    var url = buildAPIQuery(uri);
    if (DEBUG == 1) {
        console.log("makeServiceRequest(): making service request to "+url);
    }

    $.ajax({
      type: type,
      url: url,
      data: data,
      async: true,
      cache: false,
      dataType: mt_request_type,
      contentType: (mt_request_type=="xml") ? "application/xml" : "application/json",
      timeout: mt_request_timeout,
      success: function(json, statusText, request) {
        if (DEBUG == 1) {
            console.log("makeServiceRequest(): data="+json+", status="+statusText+"\n");
        }
        if (isDefined(success)) {
            if (DEBUG == 1) {
                console.log("makeServiceRequest(): executing success callback");
            }
            success(json);
        }
      },
      error: function(request, textStatus, errorThrown) {
        //alert("error: "+textStatus+" errorThrown: "+errorThrown+" response: "+request.responseText);
        if (DEBUG == 1) {
            console.log("makeServiceRequest(): status: "+textStatus+", response: "+request.responseText+", error: "+errorThrown+"\n");
        }
        if (isDefined(failure)) {
            if (DEBUG == 1) {
                console.log("makeServiceRequest(): executing failure callback");
            }
            try {
                var response = $.parseJSON(request.responseText);
                failure(response);
            } catch (ex) {
                // just pass the response text back since we couldn't get a json response object
                failure(request.responseText);
            }
        }
      }
    });
  } catch (err) {
    try {
        if (DEBUG == 1) {
            console.log("makeServiceRequest(): error: "+err);
        }
    } catch (err2) { }
  }
}

function isDefined(x) {
   return !isUndefined(x);
}

function isUndefined(x) {
   return x == null && x !== null;
}

function isNull(x) {
   return x == null;
}

function isEmpty(x) {
   return isNull(x) || isUndefined(x);
}
