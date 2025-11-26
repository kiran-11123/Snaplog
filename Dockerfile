FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install 

# 2 Build the Next.js app
FROM node:20-alpine AS builder

WORKDIR /app

COPY . .
COPY --from=build /app/node_modules ./node_modules

RUN npm run build

# 3 Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000



# Copy only what's needed for production from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Use non-root user
USER node

# Start the Next.js production server (ensure "start": "next start -p 3000" is in package.json)
CMD ["npm", "start"]
