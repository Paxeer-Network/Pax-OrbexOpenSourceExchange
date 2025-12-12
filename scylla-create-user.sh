#!/bin/bash

# Function to update an .env file
update_env_file() {
  local env_file=$1
  local key=$2
  local value=$3

  # Check if the file exists
  if [ ! -f "${env_file}" ]; then
    echo "The .env file was not found at ${env_file}. Exiting."
    exit 1
  fi

  # Escape special characters in value
  value=$(echo "$value" | sed -e 's/[\/&]/\\&/g')

  # Check if key exists in file
  if grep -q "^${key}=" "${env_file}"; then
    # Key found, update its value
    sed -i "s/^${key}=.*/${key}=\"${value}\"/" "${env_file}"
  else
    # Key not found, append it
    echo "${key}=\"${value}\"" >> "${env_file}"
  fi
}

# Function to test connection and return message
test_connection () {
  cqlsh -u "$1" -p "$2" -e "describe keyspaces;" > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo "Connection successful."
  else
    echo "Connection failed."
  fi
}

# Open cqlsh in a here-document to run a sequence of commands
read -p "Enter username: " username
read -s -p "Enter password: " password
echo ""

cqlsh -u cassandra -p cassandra <<EOL
-- Create user (will prompt for username and password)
CREATE ROLE IF NOT EXISTS '${username}' WITH PASSWORD = '${password}' AND LOGIN = TRUE AND SUPERUSER = TRUE;
EOL

# Test the connection with the new credentials
echo "Testing connection with new credentials..."
test_connection "$username" "$password"

# Update the .env file with the new ScyllaDB username and password
update_env_file ".env" "SCYLLA_USERNAME" "$username"
update_env_file ".env" "SCYLLA_PASSWORD" "$password"
