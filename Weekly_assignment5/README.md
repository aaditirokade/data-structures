### **Weekly Assignment 5 : Documentation**

#### Part1

1. For my dear diary project, I decided to record my online poker performance for atleast one round recorded daily. The final [data model](https://github.com/aaditirokade/data-structures/blob/master/Weekly_assignment5/Part1_dataModel.png) was created in Adobe Illustrator.

2. From the diagram, it's evident that the data is not structured in a way that it is redundant. e.g there can be multiple rounds of poker on a single day. So 'date' gets repeated. Similarly, the cards dealt in hold, flop, turn and river sequence can also repeat themselves with multiple rounds. Same applies to 'result' as well. Hence, deta is denormalized. 
       
3. The data can be structured depending upon the requirement (use case). Since it's in a *key:value* format, it provides a certain flexibility of the structure. We may want to use a certain structure constructed using certain key:value pairs of the same data set for particular purpose. Similar applies to the hierarchy of the data, in my opinion, it's flexible and does not affect the usage/extraction of the data much.

#### Part2

The arguments passed to the Diary constructor involved: primarykey, date, game details(round. I have intentionally skipped some variables with repetative game details such as- table type - speed, stakes, number of players etc.), card details and results. We observe that on some days, multiple rounds were played, resulting into multiple enties with same 'date' value :[javascript](https://github.com/aaditirokade/data-structures/blob/master/Weekly_assignment5/index_part2.js)

:: [output](https://github.com/aaditirokade/data-structures/blob/master/Weekly_assignment5/part2_output)
   
#### Part3

The [javascript](https://github.com/aaditirokade/data-structures/blob/master/Weekly_assignment5/index_part3.js) was written as per the instructions for [weekly assignment 5](https://github.com/visualizedata/data-structures/blob/master/assignments/weekly_assignment_05.md) with a tweak of looping for all the entries in diaryEntries.

:: [output](https://github.com/aaditirokade/data-structures/blob/master/Weekly_assignment5/part3_output.png)
