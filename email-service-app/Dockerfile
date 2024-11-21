# Step 1: Use an official Node.js runtime as the base image
FROM node:18-alpine AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Install PNPM
RUN npm install -g pnpm

# Step 4: Copy package.json and pnpm-lock.yaml to install dependencies
COPY package.json pnpm-lock.yaml ./

# Step 5: Install dependencies using PNPM
RUN pnpm install --frozen-lockfile

# Step 6: Copy the rest of the app's source code
COPY . .

# Step 7: Build the application
RUN pnpm run build


# Step 8: Set the command to run the app
CMD ["pnpm", "start:prod"]

# Step 9: Expose the port the app will run on
EXPOSE 3000
