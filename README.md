# Gulp, Bootstrap 4 base-template

I created a base template providing Bootstrap 4 (Beta 3) with gulp tasks.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

A step by step series of examples that tell you have to get a development env running

Clone the repository to your computer, in any desired directory.
```
git clone https://github.com/JeremyPercy/yarn-base-gulp-bootstrap-styleguide-template
```
After cloning this repository to your computer you need to have Yarn. If you don't have Yarn package on your computer you need to install Yarn first.
```
https://yarnpkg.com/en/docs/install
```
Make sure you have gulp client installed globally. Doing so by the following command line.
```
npm install --global gulp-cli
```
If you already have an old version of gulp -g installed please follow the next few commands to uninstall the old gulp first.
```
npm rm --global gulp
rm /usr/share/man/man1/gulp.1
```
If you have Yarn or have it installed just type the following command in your command-line:
```
yarn install
```
Yarn will have all the dependencies installed. Now you can make use of gulp by entering the follow line in your command-line and your up and running.
```
yarn run gulp
```

## How to
 You can make edit, create or remove Sass/scss and JS in the src directory. However you can direct edit the html files in the web directory. All scss and js files will be compiled in a minified version in the web/assets directory.
 You dont have to worry about dependencies they are already added with npm and compiled. Such as Jquerie and popper.js, which is needed for bootstrap. 

## Deployment

You can use the web directory to deploy it to your webhosting.

## Living Styleguide
With this starter kit you have a living styleguide. Which can help you documenting your styleguide for more information, go to
```
https://github.com/kss-node/kss-node
```

## Built With

* [Bootstrap 4](https://getbootstrap.com) 
* [Gulp](https://gulpfile.org)
* [Browser-Sync](https://www.browsersync.io) 
* [Sass](http://sass-lang.com) 
* [Babel](https://babeljs.io)
* [KSS](http://kss-node.github.io/kss-node/)

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Jeremy-Percy** - *Initial work* - [JeremyPercy](https://github.com/JeremyPercy)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

