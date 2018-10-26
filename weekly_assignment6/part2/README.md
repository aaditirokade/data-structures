### **Weekly Assignment 6 Part 2 : Documentation**

#### Part2

New table [newdeardiary](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part2/index_dataToDB.js
) was created in DynamoDB database. The table was updated to get rid of the serial no. column that previously acted as the primary key. Intead [primary key](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part2/index_noSQL.js) of the new table is a combination of *'date'* being the *partition key* and *'round'* being the *sort key* so that I can fetch an entry of a particular round on a particular date for the diary interface.
```'KeyConditionExpression': '#dt = :date AND #rd = :round' ```

:: [updated table](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part2/newdeardiaryTable.png)
:: [query output](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part2/queryOutput) for
``` ExpressionAttributeValues: { ':date': { S: 'Oct 02 2018' }, ':round': { N: '1' } } 
```
