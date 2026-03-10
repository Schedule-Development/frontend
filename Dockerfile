FROM node:20-slim

WORKDIR /app

# Copy the pre-built output and data folder
COPY .output .output
COPY data ./data

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", ".output/server/index.mjs"]
