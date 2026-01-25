this folder contains all information about the backend of noQ project. 

check the documents folder for api testing "/apps/backend/documents"

but to check them you should create and fill the .env file with the following content:

## .env file
PORT=3001

SUPABASE_URL=""
SUPABASE_SERVICE_KEY=""

### Connect to Supabase via connection pooling
DATABASE_URL=""

### Direct connection to the database. Used for migrations
DIRECT_URL=""

## before testing the apis you should go to the backend folder and run the backend:
### to run the server use the following command:
cd apps/backend
npm run dev
