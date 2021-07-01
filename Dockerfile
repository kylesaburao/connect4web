FROM node as app
COPY app/ /app
WORKDIR /app
RUN npm install
RUN npm install -g @angular/cli 
EXPOSE 4401
RUN ng build --configuration=production

FROM node as server
COPY server/ /server
COPY --from=app /app/dist /server/dist
WORKDIR /server
RUN npm install express && npm install --save path
EXPOSE 8888
CMD ["node", "server.js"]
