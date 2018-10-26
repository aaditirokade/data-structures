### **Weekly Assignment 7 : Documentation**

#### Parsing

I've borrowed [Michael's code](https://github.com/wolfm2/data-structures/blob/master/week_7/parseZones.js) temporarily to base the next bits of this assignment upon. I'll be building an alternate parser code for future purpose.

#### Latitude and Longitutes

1. Building on top of the [files](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment7/dump/output) obtained after parsing, [addresses](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment7/addresses.js) were extracted for each zone from [original text files](https://github.com/aaditirokade/data-structures/tree/master/weekly%20assignment1/data) :: [output files](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment7/dump)

2. Using the text files from previous step as input files, JSON files were saved with [Lat Long](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment7/latlong.js) info for each of the addresses :: [output files](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment7/dump)

*we faced multiple issues at this step and could not get around to build code to resolve them* :
- [zone 8](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment7/dump/m08Address.json) was missing one entry after 'lat long' aquisition step. We manually edited last entry to be able to combine files with no error.
- [zone 9](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment7/dump/m09Address.json) was missing 2 entries. We could not figure what the exact issue was. We had to input the values manually.
- [zone 10](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment7/dump/m10Address.json) had one address that repeating itself thrice. We edited it out to get rid of the errors due to mis-match in the count of entries from output1 and output2 to be able to combine both files

#### Combined JSON

[Combined](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment7/week7final.js)arguments from [output1](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment7/dump/output) & [output2](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment7/dump) to create a [combinedJSON](https://github.com/aaditirokade/data-structures/tree/master/weekly_assignment7) for each zone.
