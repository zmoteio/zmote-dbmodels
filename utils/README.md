## Importing from lirc database ##

Original [lirc remotes database](http://sourceforge.net/projects/lirc-remotes/) is converted to XML format using [lirc2xml](http://www.bengt-martensson.de/harc/lirc2xml.html) tool and is available from [github](https://github.com/probonopd/lirc-remotes). These (xml format) files have IR specification wherever possible and timing information in [ProntoEdit HEX format](https://www.remotecentral.com/features/irdisp2.htm) and are simpler to parse.

Here are commands to convert xml files to json records for use with zmote:
````bash
# get all xml files
git clone -b xml --single-branch https://github.com/probonopd/lirc-remotes.git

# convert to json (ignore files larger than 50 kB)
chmod +x ./xml2js.pl
for file in $(find lirc-remotes -name "*.xml" -size 50k); do
  echo $file
  ./xml2js.pl $file | node > ${file//.xml/.json}
done 2>&1 | tee output.txt

# ignore json files that couldn't be converted (due to syntax errors)
for file in $(find lirc-remotes -name "*.xml"); do rm -f ${file//.xml/.json}; done

# concatenate all json files to a single one, ignoring any errors
find lirc-remotes -name "*.json" -exec cat {} \; | grep -v error > converted.json

# normalize key names and generate default layouts
node layouts.js > import.json
````

The resultant `import.json` is ready to be imported to Remotes collection.

NOTE: Above steps will remove xml files that were successfully processed (without any syntax error). To recover them, simply do a fresh git checkout:
````bash
cd lirc-remotes; git checkout xml -f; cd -
````

