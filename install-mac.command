#!/bin/bash
brew install nodejs npm
# Read the user input
echo "Enter the Email id: "
read email_id
echo "Enter the authorisation token: "
read authorisation_token
touch .env
echo "REACT_APP_email_id=${email_id}" > ./main-app/.env
echo "REACT_APP_authorisation_token=${authorisation_token}" >> ./main-app/.env
