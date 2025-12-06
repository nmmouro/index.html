FROM node:18
WORKDIR /app
COPY backend ./backend
RUN cd backend && npm install || true
EXPOSE 3000
CMD ["node","backend/server.js"]
