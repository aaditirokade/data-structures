# data-structures
MSDV fa18: Data structures

### [Final Assignment 2](https://github.com/visualizedata/data-structures/tree/master/assignments/final_assignment_02) 
Documentation:: Dear Diary

[Render](https://htmlpreview.github.io/?https://github.com/aaditirokade/data-structures/blob/master/final_assignments/public/index.html)


1. The [data model](https://github.com/aaditirokade/data-structures/blob/master/Weekly_assignment5/Part1_dataModel.png) was created in Adobe Illustrator.

2. After observing the data model I realised that the table entries for certain can get repetative for certain rows. This is a denormalized data model. When a data comes out of the database, it might be contained in a JSON format file but in terms of the structure, it will not be a strict tabular format but more of grouping of the *key: value* pairs depending upon the usecases. I do not see a harsh hierarchy but a list of *key:value* pairs arranged inside a table.


3. The [js code](https://github.com/aaditirokade/data-structures/blob/master/Weekly_assignment5/index_part2.js) was written as per the instructions for [Assignment5](https://github.com/visualizedata/data-structures/blob/master/assignments/weekly_assignment_05.md)
   
:: [Output](https://github.com/aaditirokade/data-structures/blob/master/Weekly_assignment5/part2_output)


4. The [js code](https://github.com/aaditirokade/data-structures/blob/master/Weekly_assignment5/index_part3.js) was written as per the instructions with an addition of async.eachSeries to add all the values to the database.

:: [Output](https://github.com/aaditirokade/data-structures/blob/master/Weekly_assignment5/part3_output.png)


5. New table [newdeardiary](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part2/index_dataToDB.js
) was created in DynamoDB database. The table was updated to get rid of the serial no. column that previously acted as the primary key. Intead [primary key](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part2/index_noSQL.js) of the new table is a combination of *'date'* being the *partition key* and *'round'* being the *sort key* so that I can fetch an entry of a particular round on a particular date for the diary interface.
```'KeyConditionExpression': '#dt = :date AND #rd = :round' ```

:: [updated table](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part2/newdeardiaryTable.png)
:: [query output](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment6/part2/queryOutput) for
``` 
 ExpressionAttributeValues: { ':date': { S: 'Oct 02 2018' }, ':round': { N: '1' } } 
```

6. I decided to visualize one particular day from the diary.

Query(using primary and combined key):

```var params = {
        TableName: 'newdeardiary',
        KeyConditionExpression: '#dt = :date AND #rd = :round',
        ExpressionAttributeNames: { 
            "#dt" : 'date',
            "#rd" : 'round'
        },
        ExpressionAttributeValues: {
            ':date': {S: 'Nov 02 2018'},
            ':round': {N: '1'}
       }
   };
   ```

[Output](https://github.com/aaditirokade/data-structures/blob/master/weekly_assignment10/output/http:localhost:8080:deardiary.pdf)


7. Final query for final visualization was edited in a combined [server.js](https://github.com/aaditirokade/data-structures/blob/master/final_assignments/server.js) file to obtain data for a particular day

[Render](https://htmlpreview.github.io/?https://github.com/aaditirokade/data-structures/blob/master/final_assignments/public/index.html)
