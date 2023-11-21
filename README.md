<a name="readme-top"></a>
# BonORM
![BonORM](https://github.com/hhuziuk/bonORM/blob/main/logo.jpeg?raw=true)
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
      <ul>
        <li><a href="#data-types">Data types</a></li>
        <li><a href="#entity">Entity</a></li>
        <li><a href="#errors">Errors</a></li>
        <li><a href="#migrations">Migrations</a></li>
        <li><a href="#basic-operations">Basic operations</a></li>
        <li><a href="#relations">Relations</a></li>
      </ul>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>

<!-- ABOUT THE PROJECT -->
## About The Project

BonORM is my own implementation of an object-relational mapping (ORM) designed for use on the NodeJS platform and in projects developed using Typescript. I created this tool to ensure that users can use only the tools they need for their work, making the process of interacting with the database much easier and more enjoyable. BonORM makes it easy to interact with the database, providing efficient management of objects and their relationships so that your development is more productive.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This section describes the technologies and frameworks ORM can be used with.

[![Technologies](https://skillicons.dev/icons?i=ts,postgres&perline=5)](https://skillicons.dev)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started
### Installation

Here you can get in touch with installation and basic setup guide

Firstly, you should install a package from npm
* npm (as a simple dependency)
  ```sh
  npm i bonorm
  ```
* npm (as a dev dependency)
  ```sh
  npm install bonorm --save-dev
  ```

### Configuration files 

If you want to get start with concrete database, you can generate a desirable configuration

* Create configuartion file for MySQL
  ```sh
  npm run create:mySqlConfig <path> 
  ```
* Create configuartion file for PostgreSQL
  ```sh
  npm run create:pgConfig <path> 
  ```
* Your script block in package.json should look like this code snippet:
  ```json
  "scripts": {
  "create:pgConfig": "ts-node src/cli.ts create:pgConfig",
  "create:mySqlConfig": "ts-node src/cli.ts create:mySqlConfig"
  }
  ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEATURES -->
## Features
### Data types
### Entity
### Errors
### Migrations
### Migrations
### Basic operations
### Relations

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/Features`)
3. Commit your Changes (`git commit -m 'Add some Features'`)
4. Push to the Branch (`git push origin feature/Features`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact
Heorhii Huziuk - huziukwork@gmail.com

Project link: [https://github.com/hhuziuk/bonORM.git](https://github.com/hhuziuk/bonORM.git)

<p align="right">(<a href="#readme-top">back to top</a>)</p>