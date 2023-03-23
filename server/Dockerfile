FROM node:18-alpine 

# libc is needed for deps
RUN apk add --no-cache libc6-compat

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 5678
CMD [ "npm", "start" ]