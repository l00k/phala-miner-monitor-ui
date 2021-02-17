#!/usr/bin/php
<?php

// ********************
// Setup your data here

$CONTROLLER_ADDRESS = "N0xbF33FaulveRvT5QadXjv1MegKgpea6kCpHzWYMUHpwY25wbYJM2q3";
$SECRET_KEY = "321321321";

// ********************

// https://stackoverflow.com/a/52042137/1398264
function gqlFormatPayload($data, $level = 0)
{
    $result = $level > 0 ? '{ ' : '';
    $separator = '';
    foreach ($data as $key => $val) {
        $result .= $separator . $key . ': ';

        if (is_int($val)) {
            $result .= $val;
        }
        elseif (is_string($val)) {
            $result .= $val[0] === '#'
                ? substr($val, 1)
                : '"' . str_replace('"', '\"', $val) . '"';
        }
        elseif (is_bool($val)) {
            $result .= $val ? 'true' : 'false';
        }
        elseif (is_null($val)) {
            $result .= 'null';
        }
        elseif (is_object($val)) {
            $result .= gqlFormatPayload($val, $level + 1);
        }
        elseif (is_array($val)) {
            $result .= gqlFormatPayload($val, $level + 1);
        }
        else {
            $result .= $val;
        }
        $separator = ', ';
    }
    $result .= $level > 0 ? '}' : '';
    return $result;
}

// fetch cpu temperature
$_types = explode(PHP_EOL, `cat /sys/class/thermal/thermal_zone*/type`);
$_temps = explode(PHP_EOL, `cat /sys/class/thermal/thermal_zone*/temp`);

$temps = array_combine(
    array_filter($_types),
    array_map(
        function ($e) {
            return $e * 0.001;
        },
        array_filter($_temps)
    )
);

$cpu = ['temperature' => $temps['x86_pkg_temp']];

// fetch node state
$node = null;

$exists = `docker ps | grep "phala-node"`;
if ($exists) {
    $node = ['state' => '#NotRunning'];

    $running = `docker ps | grep "phala-node" | grep " Up "`;
    if ($running) {

        $statusRaw = `curl -s -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"system_health","params":[],"id":1}' localhost:9933`;
        $status = json_decode($statusRaw, true);
        if ($status['result']['isSyncing']) {
            $node = ['state' => '#InSync'];

            $syncStateRaw = `curl -s -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"system_syncState","params":[],"id":1}' localhost:9933`;
            $syncState = json_decode($syncStateRaw, true);

            $node['syncProgress'] = $syncState['result']['currentBlock'] / (float)$syncState['result']['highestBlock'];
        }
        else {
            $node = ['state' => '#Running'];
        }
    }
}

// fetch runtime state
$runtime = ['state' => '#NotRunning'];

$running = `docker ps | grep "phala-pruntime" | grep " Up "`;
if ($running) {
    $runtime = ['state' => '#NotInitiated'];

    $statusRaw = `curl -s -X POST -H "Content-Type: application/json" --data '{"input":{},"nonce":{"id":0}}' localhost:8000/get_info`;
    $status = json_decode($statusRaw, true);

    if ($status['status'] === 'ok') {
        $runtime = ['state' => '#Running'];
    }
}

// fetch host state
$host = ['state' => '#NotRunning'];

$running = `docker ps | grep "phala-phost" | grep " Up "`;
if ($running) {
    $host = ['state' => '#Running'];
}


// update request
$payload = [
    'controllerAddress' => $CONTROLLER_ADDRESS,
    'secretKey' => $SECRET_KEY,
    'deviceState' => [
        'cpu' => $cpu,
        'node' => $node,
        'runtime' => $runtime,
        'host' => $host,
    ]
];
$payloadJson = gqlFormatPayload($payload);

$gqlMutation = "mutation { updateMinerDeviceInfo ($payloadJson) { updatedAt } }";

echo $gqlMutation;
