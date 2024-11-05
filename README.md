### Build docker image from source code
```
docker build -t pukulenam-frontend-chatbot:latest --no-cache -f deploy/Dockerfile .
```


### Run container from image
```
docker run --name chatbot -p 3000:3000 pukulenam-frontend-chatbot:latest -d
```