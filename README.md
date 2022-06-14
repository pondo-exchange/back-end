# Pondo Exchange Backend

## How to Set-up

1. Clone the repo.
2. Run `npm install` to gather all requirements (ignore any warnings).
3. Create `.env` file and add the following variables:
 - SECURE_PORT=8443 (default)
 - PORT=8080 (default)
 - DB_URL="mongodb://localhost:27017/pondoexchange" (default)
 - HTTPS certificates to be added...


## MongoDB Set-up

0. Install MongoDB.
 - follow this guide https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
 - import public key: `wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -`
 - `echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list`
 - `sudo apt-get update`
 - `sudo apt-get install -y mongodb-org`


1. Add file `/etc/mongod.conf`:
```conf
# mongod.conf taken from https://github.com/mongodb/mongo/blob/master/rpm/mongod.conf

# for documentation of all options, see:
#   http://docs.mongodb.org/manual/reference/configuration-options/

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

storage:
  dbPath: /var/data/pondoexchangedb
  journal:
    enabled: true

net:
  port: 27017
  bindIp: 127.0.0.1
```

2. Change as required:
 - dbPath: /var/data/pondoexchangedb
 - port: 27017
 - bindIp: 0.0.0.0

3. Create folders `/var/data` and `/var/data/pondoexchangedb`

4. Start with the following command `mongod --config /etc/mongod.conf`, optionally create a service.

5. To learn more about creating a service visit https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/