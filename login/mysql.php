<?php
header("Content-type: text/html;charset=utf-8");
$con = mysql_connect("qdm208731188.my3w.com", "qdm208731188", "funnsy716057");
mysql_select_db('qdm208731188_db');
if (!$con) {
    die('Could not connect: ' . mysql_error());
}

mysql_select_db("my_db", $con);
mysql_query("set names utf8;");



?>