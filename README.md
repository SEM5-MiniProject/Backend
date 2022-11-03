# Backend

<b>Link</b>

<p>https://mealdiaries.herokuapp.com/</p>


<b>API DOCS</b>

<p>https://mealdiaries.herokuapp.com/api-docs</p>



<b>Admin</b>

<p>https://mealdiaries.herokuapp.com/admin</p>
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