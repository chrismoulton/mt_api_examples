#!/bin/bash

# Copyright 2010, MediaTemple, Inc.

# get options from mtapi.conf
if [ -e "mtapi.conf" ]; then
    . mtapi.conf
fi

# set defaults
API_BASE_URL=${API_BASE_URL:="https://api.mediatemple.net/api/v1"}
API_KEY=${API_KEY:=""}
API_PRETTY_PRINT=${API_PRETTY_PRINT:="true"}
API_WRAP_ROOT=${API_WRAP_ROOT:="true"}
API_FORMAT=${API_FORMAT:="json"}

# determine content type
if [ "$API_FORMAT" == "xml" ]; then
    CONTENT_TYPE="application/xml"
else
    CONTENT_TYPE="application/json"
fi

SERVICE_IDS_URI="/services/ids"
SERVICE_TYPES_URI="/services/types"
SERVICE_INFO_URI="/services"
ADD_SERVICE_URI="/services"
ALL_SERVICE_INFO_URI="/services"
SERVICE_STATS_URI="/stats"
WARNINGS_URI="/stats/warnings"
WARNINGS_THRESHOLDS_URI="/stats/warnings/thresholds"
REBOOT_URI="/services/serviceId/reboot"
FLUSH_FIREWALL_URI="/services/serviceId/firewall/flush"
ADD_TEMP_DISK_URI="/services/serviceId/disk/addTemp"
SET_ROOT_PASS_URI="/services/serviceId/rootPassword"

function usage() {
    echo "usage: mtapi.sh <command> [<params>]*"
    echo "== Service List Commands =="
    echo "  services            : get the service info for all services"
    echo "  serviceIds          : get a list of all service ids"
    echo "  service <serviceId> : get the service info for a single service"
    echo "  serviceTypes        : get a list of valid service types"
    echo ""
    echo "== Service Admin Commands =="
    echo "  addService <serviceType> <domain> : get the service info for a single service"
    echo "  reboot <serviceId>                : reboot the specified service"
    echo "  flushFirewall <serviceId>         : flushes the firewall for the specified service"
    echo "  addTempDisk <serviceId>           : adds temporary disk space for the specified service"
    echo "  setRootPass <serviceId> <pass>    : set root password for the specified service"
    echo ""
    echo "== Stats Commands =="
    echo "  stats <serviceId> : get the stats for a single service"
    echo "                      optional: -s <start> -e <end>, -p <precision>, -r <resolution>, -d <predefined>"
    echo "  warnings          : get the service warnings for an account"
    echo "  thresholds        : get the service warning thresholds"
    echo ""
    echo "== Options =="
    echo "  API_KEY          : the api key used to authenticate"
    echo "  API_PRETTY_PRINT : true=pretty print (default: true)"
    echo "  API_WRAP_ROOT    : true=wrap json object with root object name (default: true)"
    echo "  API_FORMAT       : json=JSON data, xml=XML data (default: json)"
    echo "  TEST_ONLY        : true=print out the curl, but don't execute it (default: false)"

    if [ -n "$1" ]; then
        echo
        echo "$1"
    fi
    exit
}

function my_curl() {
    URI=""
    if [ -n "$1" ]; then
        URI="$1"
    fi

    echo "curl -D log.txt -H \"Accept: $CONTENT_TYPE\" $AUTH_PARAMS \"$URI\""
    if [ -z "$TEST_ONLY" ]; then
        eval "curl -D log.txt -H \"Accept: $CONTENT_TYPE\" $AUTH_PARAMS \"$URI\""
    fi
}

function my_curl_post() {
    URI=""
    DATA=""
    if [ -n "$1" ]; then
        URI="$1"
    fi

    if [ -n "$2" ]; then
        DATA="$2"
    fi

    echo "curl -D log.txt -X POST --data '$DATA' -H \"Content-type: $CONTENT_TYPE\" $AUTH_PARAMS \"$URI\""
    if [ -z "$TEST_ONLY" ]; then
        eval "curl -D log.txt -X POST --data '$DATA' -H \"Content-type: $CONTENT_TYPE\" $AUTH_PARAMS \"$URI\""
    fi
}

function my_curl_put() {
    URI=""
    if [ -n "$1" ]; then
        URI="$1"
    fi

    PASS=""
    if [ -n "$2" ]; then
        PASS="$2"
    fi

    if [ "$API_FORMAT" == "xml" ]; then
        echo "curl -D log.txt -X PUT -H \"Content-type: $CONTENT_TYPE\" -d '<password>$PASS</password>' $AUTH_PARAMS \"$URI\""
    else
        echo "curl -D log.txt -X PUT -H \"Content-type: $CONTENT_TYPE\" -d '{\"password\": \"$PASS\"}' $AUTH_PARAMS \"$URI\""
    fi
    if [ -z "$TEST_ONLY" ]; then
        if [ "$API_FORMAT" == "xml" ]; then
            eval "curl -D log.txt -X PUT -H \"Content-type: $CONTENT_TYPE\" -d '<password>$PASS</password>' $AUTH_PARAMS \"$URI\""
        else
            eval "curl -D log.txt -X PUT -H \"Content-type: $CONTENT_TYPE\" -d '{\"password\": \"$PASS\"}' $AUTH_PARAMS \"$URI\""
        fi
    fi
}

if [ $# -eq "0" ]; then
    usage
fi

while getopts ":s:e:p:r:d:" options; do
  case $options in
    s ) START=$OPTARG;;
    e ) END=$OPTARG;;
    p ) PRECISION=$OPTARG;;
    d ) PREDEFINED=$OPTARG;;
    r ) RESOLUTION=$OPTARG;;
  esac
done
shift $(($OPTIND - 1))

API_PARAMS="prettyPrint=$API_PRETTY_PRINT&wrapRoot=$API_WRAP_ROOT"
if [ -n "$API_KEY" ]; then
    AUTH_PARAMS="-H 'Authorization: MediaTemple $API_KEY'"
else
    usage "** Must specify an api key to use (API_KEY) **"
fi

if [ "$1" == "services" ]; then
    my_curl "$API_BASE_URL$ALL_SERVICE_INFO_URI?$API_PARAMS"
elif [ "$1" == "serviceIds" ]; then
    my_curl "$API_BASE_URL$SERVICE_IDS_URI?$API_PARAMS"
elif [ "$1" == "serviceTypes" ]; then
    my_curl "$API_BASE_URL$SERVICE_TYPES_URI?$API_PARAMS"
elif [[ ("$1" == "service") && (-n "$2") ]]; then
    my_curl "$API_BASE_URL$SERVICE_INFO_URI/$2?$API_PARAMS"
elif [[ ("$1" == "stats") && (-n "$2") ]]; then
    if [ -n "$PRECISION" ]; then
        API_PARAMS="$API_PARAMS&precision=$PRECISION"
    fi
    if [ -n "$RESOLUTION" ]; then
        API_PARAMS="$API_PARAMS&resolution=$RESOLUTION"
    fi
    if [[ (-n "$START") && (-n "$END") ]]; then
        API_PARAMS="$API_PARAMS&start=$START&end=$END"
    fi
    if [ -n "$PREDEFINED" ]; then
        EXTRA="/$PREDEFINED"
    fi

    my_curl "$API_BASE_URL$SERVICE_STATS_URI/$2$EXTRA?$API_PARAMS"
elif [ "$1" == "addService" ]; then
    if [ "$API_FORMAT" == "xml" ]; then
        my_curl_post "$API_BASE_URL$ADD_SERVICE_URI?$API_PARAMS" "<service><serviceType>$2</serviceType><primaryDomain>$3</primaryDomain></service>"
    else
        my_curl_post "$API_BASE_URL$ADD_SERVICE_URI?$API_PARAMS" "{ \"serviceType\": $2, \"primaryDomain\": \"$3\"}"
    fi
elif [ "$1" == "warnings" ]; then
    my_curl "$API_BASE_URL$WARNINGS_URI?$API_PARAMS"
elif [ "$1" == "thresholds" ]; then
    my_curl "$API_BASE_URL$WARNINGS_THRESHOLDS_URI?$API_PARAMS"
elif [[ ("$1" == "reboot") && (-n "$2") ]]; then
    URI=`echo -e ${REBOOT_URI//serviceId/$2}`
    my_curl_post "$API_BASE_URL$URI?$API_PARAMS"
elif [[ ("$1" == "flushFirewall") && (-n "$2") ]]; then
    URI=`echo -e ${FLUSH_FIREWALL_URI//serviceId/$2}`
    my_curl_post "$API_BASE_URL$URI?$API_PARAMS"
elif [[ ("$1" == "addTempDisk") && (-n "$2") ]]; then
    URI=`echo -e ${ADD_TEMP_DISK_URI//serviceId/$2}`
    my_curl_post "$API_BASE_URL$URI?$API_PARAMS"
elif [[ ("$1" == "setRootPass") && (-n "$2") && (-n "$3")]]; then
    URI=`echo -e ${SET_ROOT_PASS_URI//serviceId/$2}`
    my_curl_put "$API_BASE_URL$URI?$API_PARAMS" "$3"
else
    usage
fi

echo
