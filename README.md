# Gulp, Bootstrap 4 base-template

I created a base template providing Bootstrap 4 with gulp tasks.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

A step by step series of examples that tell you have to get a development env running

Clone the repository to your computer, in any desired directory.
```
git clone https://github.com/JeremyPercy/Gulp-starter-kit
```
After cloning this repository to your computer you need to have Yarn. If you don't have Yarn package on your computer you need to install Yarn first.
```
https://yarnpkg.com/en/docs/install
```
Make sure you have gulp client installed globally. Doing so by the following command line. Note: If you don't have Gulp client or you dont want it installed on your computer then there is no need for. Script wil work also without having gulp installed globally.
```
npm install --global gulp-cli
```
If you already have an old version of gulp -g installed please follow the next few commands to uninstall the old gulp first.
```
npm rm --global gulp
rm /usr/share/man/man1/gulp.1
```
In the directory there is a file attached called example.gulp-config.json. You need to copy this file and rename it to gulp config. use to follow command in your folder.
```
cp example.gulp-config.json gulp-config.json
```
You may edit your config file to the paths of your needs. If you have a server running you can just simpily add the URL in the localURL function.

If you have Yarn or have it installed just type the following command in your command-line:
```
yarn start
```
Yarn will have all the dependencies installed and will run gulp. 


## How to
 You can make edit, create or remove Sass/scss and JS in the src directory. However you can direct edit the html files in the web directory. All scss and js files will be compiled in a minified version in the web/assets directory.
 You dont have to worry about dependencies they are already added with npm and compiled. Such as Jquery and popper.js, which is needed for bootstrap. 

## Deployment

You can use the web directory to deploy it to your webhosting.

## Built With

* [Bootstrap 4](https://getbootstrap.com) 
* [Gulp](https://gulpfile.org)
* [Browser-Sync](https://www.browsersync.io) 
* [Sass](http://sass-lang.com) 
* [Babel](https://babeljs.io)

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Jeremy-Percy** - *Initial work* - [JeremyPercy](https://github.com/JeremyPercy)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

