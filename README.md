# Backend

[![Node.js CI](https://github.com/SEM5-MiniProject/Backend/actions/workflows/node.js.yml/badge.svg)](https://github.com/SEM5-MiniProject/Backend/actions/workflows/node.js.yml)
[![Heroku Deploy](https://github.com/SEM5-MiniProject/Backend/actions/workflows/heroku.yml/badge.svg?branch=main&event=workflow_run)](https://github.com/SEM5-MiniProject/Backend/actions/workflows/heroku.yml)
[![Docker Hub](https://github.com/SEM5-MiniProject/Backend/actions/workflows/dockerhub.yml/badge.svg)](https://github.com/SEM5-MiniProject/Backend/actions/workflows/dockerhub.yml)

<b>Link</b>

<p>https://mealdiaries.herokuapp.com/</p>

![Shop](https://res.cloudinary.com/dvdi2oaso/image/upload/v1670329384/GithubProfile/img/shop_gfnwc8.png)

&nbsp;

![Cart](https://res.cloudinary.com/dvdi2oaso/image/upload/v1670329382/GithubProfile/img/cart_kluxb7.png)

<b>API DOCS</b>

<p>https://mealdiaries.herokuapp.com/api-docs</p>

<b>Admin</b>

<p>https://mealdiaries.herokuapp.com/admin</p>

<b>Docker Hub</b>

<p>https://hub.docker.com/r/salmanad01/mealdiaries</p>
<h4> Get Started</h4>
</br>

```
    npm install --global yarn
    yarn install 
```

<h4> How To Run </h4>

```
    yarn run dev
```

<h4>Commands To Spin Docker Container</h4>

```
  docker compose up
```

<h4>For Development</h4>

```
  docker compose -f .\docker-compose-dev.yml up
```

<h4>Remove cache and build</h4>

```
  docker compose up --build --remove-orphans --force-recreate
```

<h4>Run From Docker Hub</h4>

```
docker run --env-file .env -p 5000:5000 salmanad01/mealdiaries:latest
```
