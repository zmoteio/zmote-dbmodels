#!/bin/perl
use File::Basename;
$dir = basename(dirname($ARGV[0]));
$dir =~ s/\'/\\'/g;
print "var brand ='$dir';\n";
$file = basename($ARGV[0]);
$file =~ s/\.xml//;
$file =~ s/\'/\\'/g;
print "var model = '$file';\n";
print "var remote = require('./remote');\n";
open(INPUT, $ARGV[0]);
$s = 0;
foreach (<INPUT>) {
	s/^/\/\//;
	s/\\/\\\\/g;
	s/\'/\\\'/g;
	s/.*<remote name=.([^\"]+).*/remote.reset();\nremote.set('name', '\1');/;
	$s = 1 if (/<code name=/);
	s/.*<code name=.([^\"]+).*\n/remote.key('\1', /;
	s/.*<decoding protocol=.([^\"]+).*device=.([^\"]+).*subdevice=.([^\"]+).*obc=.([^\"]+).*misc=.([^\"]+).*\n/'\1', \2, \3, \4, '\5', /, $s = 2 if ($s == 1 && /<decoding protocol=/);
	s/.*<ccf>([^\<]+)<\/ccf>.*\n/'none', 0, 0, 0, 'none', '\1');\n/, $s = 3 if ($s == 1 && /<ccf/);
	s/.*<ccf>([^\<]+)<\/ccf>.*\n/'\1');\n/, $s = 3 if ($s == 2 && /<ccf/);
	s/.*<\/remote.*/remote.end();/;
	next if(/^\s*<\// || /<lirc/);
	print "$_" if (!/^\/\//);
}
print "var fs = require('fs');\n";
$file = $ARGV[0];
$file =~ s/\'/\\'/g;
print "fs.unlink('$file');\n"
