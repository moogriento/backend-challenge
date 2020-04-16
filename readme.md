## About the App
This is a small app with a single endpoint that receives a CSV file which may have different columns. From where to pick the data (columns) is defined by a configuration that changes according to the provider. All file data then must be saved in a db.

## Requirements
NodeJS 12 or higher

## Dependencies
- express: Web Server
- express-fileupload: Middleware to obtain the attached csv file
- @fast-csv/parse: To parse the csv file in a stream
- mongoose
- mongodb-memory-server

## Assumptions
- CSV files come with no headers.
- There is no data validation (types, formats, etc.)
- CSV files can be huge.
- files uploaded are moved to the `uploads` folder in the app root

## Design decisions
- The core of the app resides in handling potential huge files. Effort is invested in making that possible instead of other aspects (such as validations)
- Once the file is saved (uploaded) the user gets a response from the server. No need to wait for the whole file to be processed. Here we could return a track id code the user can use later to check the progress. 
- CSV files can be huge. `fast-csv` was chosen because it works with streams. We can read the file as a stream and pipe it to `fast-csv` to process it.
- While reading the CSV file, we can also start creating the chunks to be sent to the DB, so no need to use a external library to create the chunks after the whole file was processed (do not iterate twice the total of rows)
- Every row of the CSV is read as an array of column values (i.e. `['JN1AZ4EHXDM752905', 'Audi', '4000CS']`), so we can just pick the needed column by knowing the index (position) from a config file
- Importing the data to the db must be done in chunks to avoid overloading the server (and the db). Each import is executed in a different tick of the event loop.


## Usage
In the project directory:
1. Install all dependencies `npm install`
2. Run `npm start`
  
Runs the app in port 3000.
 
#### Invoking the endpoint
Invoke the endpoint with the following attributes. A third party app like postman can be used to ease the testing.

HTTP Post method to `http:localhost:3000/upload`

Headers
- Content-Type: multipart/form-data

Body (parameters)
- provider: The name of the provider to use
- csvFile: the attached csv file to upload

#### Test data

Provider values:
- "test-provider-1": Has a configuration of no extra columns
Below is the configuration. The number indicates in which column the data is expected. i.e. `mileague` comes in the 4th column (zero-based index)
```
vin: 0
make: 1
model: 2
mileague: 3
year: 4
price: 5
zipCode: 6
createDate: 7
updateDate: 8
```

- "test-provider-2": Has a configuration of extra columns (the required ones plus extra ones that are no needed)
```
vin: 1
make: 2
model: 3
mileague: 5
year: 6
price: 7
zipCode: 8
createDate: 9
updateDate: 12
```

CSV Files:
Files are located in the `sample-files` folder. The name of the folder indicates which provider to use as well as the amount of rows.
 
## Testing
Testing has been done using `Jest`. To run all tests:

`npm test`

