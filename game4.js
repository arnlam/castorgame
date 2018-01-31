//window.addEventListener('load', function(){

'use strict';

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  /************** CANVAS *************/
  var canvas = document.getElementById('game'),
      ctx = canvas.getContext('2d');
  canvas.width = 1000;
  canvas.height = 800;
  var aleatoire = Math.floor((Math.random() +1) *200);

  /************** CHARGEMENT *************/
  var castorImg = new Image();
  castorImg.src = 'castorsprites.png';
  var gardeImg = new Image();
  gardeImg.src = 'gardesprites.png';
  var rondinImg = new Image();
  rondinImg.src = 'rondins.png';
  var caisseImg = new Image();
  caisseImg.src = 'caissessprites.png';
  var bg2Img = new Image();
  bg2Img.src = 'bg2.png';
  var pasSnd = new Audio('pas1.wav');
  var lancerSnd = new Audio('lancer.wav');
  var rondinSnd = new Audio('rondin.wav');
  var ouilleSnd = new Audio('ouille.mp3');
  var backgroundImg = new Image();
  backgroundImg.src = 'background.png';
  var pinataImg = new Image();
  pinataImg.src = 'pinatasprites.png';


  /************** BOUCLE JEU *************/
  var game = {
    render: function(){

      this.clearCanvas();
      ctx.save(); // caméra
      if(castor.moveX + castor.width / castor.nombredImages / castor.scalingImg  > canvas.width / 2 ){
        ctx.translate(canvas.width/2-(castor.moveX + castor.width / castor.nombredImages / castor.scalingImg ), 0);
      }
      this.rendu();
      for (var i = 0; i < bigArray.length; i++){
        for (var j = 0; j < bigArray.length; j++){
          if (bigArray[i] !== bigArray[j] && bigArray[i].status !=='mort' && bigArray[j].status !=='mort'){
            bigArray[i].detectCollision(bigArray[j]);
            if ((bigArray[i].type ==='garde' || bigArray[i].type ==='pinata') && bigArray[i].collision === 'rondin'){
              rondinSnd.play();
              bigArray[i].impact(); //impact sur l'ennemi
              delete bigArray[j].moveX; // suppression du rondin
              break;
            }
            if (bigArray[i].type ==='caisse' && bigArray[i].collision === 'rondin'){
              rondinSnd.play();
              bigArray[i].impact(bigArray[i]); //impact sur la caisse
              delete bigArray[j].moveX; // suppression du rondin
              break;
            }
            castor.actionCollision();
          }
        }
      }

      this.end();
      ctx.restore();
    },

    animation: function(period){
      var that = this;
      var initialTimestamp;
      var nextRefresh = function(timestamp){
        if (initialTimestamp === undefined) {
          initialTimestamp = timestamp;
        } else {
          var decay = timestamp - initialTimestamp;
          if (decay >= period) {
            initialTimestamp = timestamp;
            that.render();
          }
        }
        window.requestAnimationFrame(nextRefresh);
      };
      nextRefresh(0);
    },

    clearCanvas: function(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },

    rendu: function(){
      bg2.render();
      bg.render();
      caisse1.render();
      for (var i=0; i < tableauCaisse.length; i++){
        tableauCaisse[i].render();
      }
      for (var i=0; i < gardesTableau.length; i++){
        gardesTableau[i].update();
        gardesTableau[i].render();
      }
      castor.update();
      castor.render();
      for (var i=0; i < rondinTableau.length; i++){
      rondinTableau[i].rondinUpdate();
      rondinTableau[i].anim();
      rondinTableau[i].render();
    }
      if(pinata.moveX < castor.moveX + canvas.width){
        document.getElementById('pinata').style.opacity = 1;
      }
  },
    end: function(){
      if(tableauCaisse.length === 0){
        window.removeEventListener('keydown', appui);
        window.removeEventListener('keyup', lachetouche);
        document.getElementById('ecran2').style.display = 'initial';
        document.getElementById('telecharger').addEventListener('click', function(){
          document.location = 'CV.pdf';
        });
        document.getElementById('relaunchfin').addEventListener('click', function(){
          document.location.reload();
        });

      }
    }
  };

  /**************Constructeur de base *************/
  var ConstrObjet = function(width, height, type, img, positionInitX, positionInitY){
    this.image = img;
    this.moveSpriteX = 0; this.moveSpriteY = 0; this.width = 0; this.height = 0; this.moveX = 0; this.moveY = 0;
    this.scalingImg = 1;
    this.width = width;
    this.height = height;
    this.type = type;
    this.positionInitX = positionInitX;
    this.positionInitY = positionInitY;
    this.moveX =  positionInitX;
    this.moveY = positionInitY;
    this.nombredImages = 1;
    this.scalingImg =1;
  };

  ConstrObjet.prototype.render = function(){
  ctx.drawImage(this.image, //1 - image source
    this.moveSpriteX,
    this.moveSpriteY, // 3 - Y depuis bord de l'image
    this.width, // 4 - largeur à récupérer pour l'image dessinée
    this.height, // 5 - hauteur à récupérer pour l'image dessinée
    this.moveX,// 6 - position X sur le canvas
    this.moveY, // 7 - position Y sur le canvas
    this.width, // 8- largeur reproduite sur le canvas
    this.height// 9-  hauteur reproduite sur le canvas
    );
  };
  ConstrObjet.prototype.detectCollision = function(element){
    if (element.status !== 'mort'){
      var widthObjet = this.width / this.nombredImages / this.scalingImg;
      var heightObjet = this.height / this.nbrImagesY / this.scalingImg;
      var widthElement = element.width / element.nombredImages / element.scalingImg ;
      var heightElement = element.height / element.nbrImagesY / element.scalingImg ;

      var vX =  (this.moveX + widthObjet) - (element.moveX + widthElement);
      var vY =  (this.moveY + heightObjet) - (element.moveY + heightElement);
      var semiWidth = (widthObjet / 2) + (widthElement / 2 -40);
      var semiHeight = (heightObjet / 2) + (heightElement / 2);
      if (Math.abs(vX) < semiWidth && (this.moveY < element.moveY + heightElement && this.moveY + heightObjet > element.moveY )){
        this.collision = element.type;
        return true;
      } else{
        this.collision = 'nothing';
      }
    }//
  };
  /************** Objet fixe hérité de Objet *************/
  var ConstrObjetFixe = function(width, height, type, img, positionInitX, positionInitY, positionSpriteX, positionSpriteY){
    this.width = width;
    this.height = height;
    this.type = type;
    this.image = img;
    this.status = 'objetFixe';
    this.positionInitX = positionInitX;
    this.positionInitY = positionInitY;
    this.moveX =  positionInitX;
    this.moveY = positionInitY;
    this.scalingImg = 2;
    this.nombredImages = 4;
    this.nbrImagesY = 4;
    this.positionSpriteX = positionSpriteX; // en nombre d'image -1
    this.positionSpriteY = positionSpriteY;// en nombre d'image -1
    this.palmares = '';
  };

  ConstrObjetFixe.prototype = new ConstrObjet();

  ConstrObjetFixe.prototype.render = function(){
  ctx.drawImage(this.image, //1 - image source
    (this.width  / this.nombredImages)* this.positionSpriteX, // 2 - X depuis bord de l'image source
    (this.height / this.nbrImagesY)* this.positionSpriteY, // 3 - Y depuis bord de l'image source
    this.width / this.nombredImages, // 4 - largeur à récupérer pour l'image dessinée
    this.height / this.nbrImagesY, // 5 - hauteur à récupérer pour l'image dessinée
    this.moveX,// 6 - position X sur le canvas
    this.moveY, // 7 - position Y sur le canvas
    this.width / this.nombredImages /  this.scalingImg, // 8- largeur reproduite sur le canvas
    this.height / this.scalingImg / this.nbrImagesY // 9-  hauteur reproduite sur le canvas
    );
  };

  ConstrObjetFixe.prototype.impact = function(target, indice){
    this.positionSpriteX = 0;
    this.positionSpriteY = 3;
    this.collision = 'nothing';

    setTimeout(function(){
      delete target.moveX;
      tableauCaisse.splice(tableauCaisse.indexOf(target), 1);
    }, 300);


    switch (this.palmares){       // ajout de l'élément HTML
      case 'html':
        document.getElementById('palmares').innerHTML += '<li class="list-group-item"><span class="badge badge-pill badge-success">Succès !</span> HTML 5</li>';
        break;
      case 'css':
        document.getElementById('palmares').innerHTML += '<li class="list-group-item"><span class="badge badge-pill badge-success">Succès !</span> CSS 3</li>';
        break;
      case 'js':
        document.getElementById('palmares').innerHTML += '<li class="list-group-item"><span class="badge badge-pill badge-success">Succès !</span> Javascript</li>';
        break;
      case 'jquery':
        document.getElementById('palmares').innerHTML += '<li class="list-group-item"><span class="badge badge-pill badge-success">Succès !</span> jQuery</li>';
        break;
      case 'angular':
        document.getElementById('palmares').innerHTML += '<li class="list-group-item"><span class="badge badge-pill badge-success">Succès !</span> AngularJS</li>';
        break;
      case 'mongo':
        document.getElementById('palmares').innerHTML += '<li class="list-group-item"><span class="badge badge-pill badge-success">Succès !</span> mongoDB</li>';
        break;
      case 'node':
        document.getElementById('palmares').innerHTML += '<li class="list-group-item"><span class="badge badge-pill badge-success">Succès !</span> nodeJS</li>';
        break;
      case 'express':
        document.getElementById('palmares').innerHTML += '<li class="list-group-item"><span class="badge badge-pill badge-success">Succès !</span> express JS</li>';
        break;
      case 'meteor':
        document.getElementById('palmares').innerHTML += '<li class="list-group-item"><span class="badge badge-pill badge-success">Succès !</span> Meteor</li>';
        break;
      case 'ps':
        document.getElementById('palmares').innerHTML += '<li class="list-group-item"><span class="badge badge-pill badge-success">Succès !</span> Photoshop</li>';
        break;
      case 'ai':
        document.getElementById('palmares').innerHTML += '<li class="list-group-item"><span class="badge badge-pill badge-success">Succès !</span> Illustrator</li>';
        break;
      case 'id':
        document.getElementById('palmares').innerHTML += '<li class="list-group-item"><span class="badge badge-pill badge-success">Succès !</span> InDesign</li>';
        break;
      }

  };

  /************** Objet mouvant hérité de Objet *************/
  var ConstrObjetMouvant = function(width, height, type, img, positionInitX, positionInitY){
    this.width = width;
    this.height = height;
    this.type = type;
    this.image = img;
    this.status = 'static';
    this.indexCompteur = 0;
    this.chiffreCompteur = 0;
    this.nombredImages = 4;
    this.comptageParImage = 4;
    this.scalingImg = 2;
    this.nbrImagesY = 1;
    this.positionInitX = positionInitX;
    this.positionInitY = positionInitY;
    this.moveX =  positionInitX;
    this.moveY = positionInitY;

  };
  ConstrObjetMouvant.prototype = new ConstrObjet();

  ConstrObjetMouvant.prototype.render = function(){
  ctx.drawImage(this.image, //1 - image source
    this.indexCompteur * this.width / this.nombredImages, // 2 - X depuis bord de l'image source
    this.moveSpriteY, // 3 - Y depuis bord de l'image source
    this.width / this.nombredImages, // 4 - largeur à récupérer pour l'image dessinée
    this.height / this.nbrImagesY, // 5 - hauteur à récupérer pour l'image dessinée
    this.moveX,// 6 - position X sur le canvas
    this.moveY, // 7 - position Y sur le canvas
    this.width / this.nombredImages /  this.scalingImg, // 8- largeur reproduite sur le canvas
    this.height / this.scalingImg / this.nbrImagesY // 9-  hauteur reproduite sur le canvas
    );

  };
  ConstrObjetMouvant.prototype.anim = function(){
    if (this.chiffreCompteur > this.comptageParImage -3) {
      this.chiffreCompteur = 0;
      if (this.indexCompteur < this.nombredImages - 1) {
        this.indexCompteur += 1;
      } else {
        this.indexCompteur = 0;
      }
    }
  this.chiffreCompteur += 1;
  };

  ConstrObjetMouvant.prototype.rondinUpdate = function(){
    if(this.moveX > this.positionInitX + canvas.width/2){
      delete this.moveX;
    }
    this.moveX += 40;
  };

  var initEnnemi = (function(){
    var ConstrEnnemi = function(width, height, type, img, positionInitX){
      this.width = width;
      this.height = height;
      this.type = type;
      this.image = img;
      this.positionInitX = positionInitX;
      this.pas = 0;
      this.moveX = positionInitX;
      this.moveY = canvas.height - 380;
      this.life = 30;
      this.nbrImagesY = 3;
      this.nbrImagesY = 2;
      this.vitesseEnnemi = 5;
    };

    ConstrEnnemi.prototype = new ConstrObjetMouvant();

    ConstrEnnemi.prototype.impact = function(){
        this.moveX += 50;
        this.collision = 'nothing';
        this.life -= 10;
        if(this.type ==='pinata'){
          this.life -= 10;
          if(this.life < 80){
            document.getElementById('barrepinata').style.backgroundColor = '#ffba00';
          }
          if (this.life < 40){
            document.getElementById('barrepinata').style.backgroundColor = '#ff3600';
          }
          document.getElementById('barrepinata').style.width = this.life + '%';
        }
        if(this.life === 0){
          this.status = 'mort';
          this.moveSpriteY = 1000;
      }
    };

    ConstrEnnemi.prototype.update = function(tableau, numIndex){

      if (this.chiffreCompteur > this.comptageParImage) {
        this.chiffreCompteur = 0;
        if (this.indexCompteur < this.nombredImages - 1) {
          this.indexCompteur += 1;
        } else {
          this.indexCompteur = 0;
        }
      }
      this.chiffreCompteur += 1;
      this.pas++;
      if (this.status !== 'mort' && this.pas < Math.floor(aleatoire/2)){
        this.moveX += this.vitesseEnnemi;
      }
      if (this.status !== 'mort' && this.pas >= Math.floor(aleatoire / 2) && this.pas < Math.floor(aleatoire)){
        this.moveSpriteY = this.height /this.nbrImagesY;
        this.moveX -=this.vitesseEnnemi;
      }
      if (this.status !== 'mort' && this.pas >= Math.floor(aleatoire)){
        this.moveSpriteY = 0;
        this.pas = 0;
        aleatoire = Math.floor((Math.random() +1) *200);
      }
    };
    return function(width, height, type, img, positionInitX){
      return new ConstrEnnemi(width, height, type, img, positionInitX);
    };
  }());

  var initConstrCastor = (function(){
    var ConstrCastor = function(width, height, type, img){
      this.width = width;
      this.height = height;
      this.type = type;
      this.image = img;
      this.moveY = canvas.height - 330;
      this.status = 'static';
      this.vx = 20;
      this.collision = 'nothing';
      this.vy = 0;
      this.gravite = 0.5;
      this.jump = '';
      this.positionInitY = canvas.height - 330;
      this.positionInitX = this.width/2 - this.width/4;
      this.moveX = this.positionInitX;
      this.life = 101;
      this.nbrImagesY = 4;
      this.scalingImg = 2.5;
    };

    ConstrCastor.prototype = new ConstrObjetMouvant();

  /************** Mouvements du castor *************/

    ConstrCastor.prototype.update = function(){
    // Ralentissement de du chanement d'images sur le sprite
      if (this.chiffreCompteur > this.comptageParImage) {
        this.chiffreCompteur = 0;
        if (this.indexCompteur < this.nombredImages - 1) {
          this.indexCompteur += 1;
        } else {
          this.indexCompteur = 0;
        }
      }
      this.chiffreCompteur += 1;

    //mouvements

      if (this.jump === 'saut'){

        if (this.moveY >  this.positionInitY +1){
          this.moveY = this.positionInitY;
          this.vy = 0;
          this.jump = '';
          this.status = 'static';
        }
        this.vy += this.gravite*1.2;
        this.moveY += this.vy;
      }
      // déplacement droite/gauche
      if (this.status !== 'static'){
        if (this.status === 'gauche' && this.moveX >= 200){
          this.moveX -= this.vx;
          pasSnd.play();

          if (bg2.moveSpriteX>0){
            bg2.moveSpriteX -= 2;
          }
        }
        if (this.status === 'droite' && this.moveX + (this.width / this.nombredImages / this.scalingImg) < bg.width - this.vx - canvas.width/2){
          this.moveX += this.vx;
            pasSnd.play();
          if (bg2.moveSpriteX<bg2.width - canvas.width){
            bg2.moveSpriteX += 2;
          }
        }
      }
      // sauts latéraux
      if (this.status === 'gauche-saut' && this.moveX >= 200){
        this.moveX -= this.vx;
        if (bg2.moveSpriteX>0){
          bg2.moveSpriteX -= 2;
        }
      }
      if (this.status === 'droite-saut' && this.moveX + (this.width / this.nombredImages / this.scalingImg) < bg.width - this.vx - canvas.width/2){
        this.moveX += this.vx;
        if (bg2.moveSpriteX<bg2.width - canvas.width){
          bg2.moveSpriteX += 2;
        }
      }
      this.render();
    };

    ConstrCastor.prototype.actionCollision = function(){
      if (this.collision === 'garde' || this.collision === 'pinata'){
        this.life -= 20;
        ouilleSnd.play();
        if(this.life < 80){
          document.getElementById('barre').style.backgroundColor = '#ffba00';
        }
        if (this.life < 40){
          document.getElementById('barre').style.backgroundColor = '#ff3600';
        }
        if (this.life <= 1){
          window.removeEventListener('keydown', appui);
          window.removeEventListener('keyup', lachetouche);
          this.status = 'mort';
          this.moveSpriteY = 1500;
          document.getElementById('relaunch').addEventListener('click', function(){
            document.location.reload();
          });
          document.getElementById('ecran3').style.display = 'initial';
        }
        document.getElementById('barre').style.width = this.life + '%';
        this.status = 'coma';
        castor.vy = -12;
        var boum = setInterval(function(){
          castor.moveX -= 20;
          castor.vy += castor.gravite;
          castor.moveY += castor.vy;
          if (castor.moveY > castor.positionInitY+1){
            clearInterval(boum);
            castor.status='static';
            castor.moveY = castor.positionInitY;
            castor.vy = 0;
          }
        },20);
      }
    };
    return function(width, height, type, img){
      return new ConstrCastor(width, height, type, img);
    };
  }());


  /************** Création objets et personnages *************/
    var castor = initConstrCastor(1600,2000, 'player', castorImg); // Nouveau castor
    var bg = new ConstrObjet(8517,700, 'background', backgroundImg, 0, 0);
    var bg2 = new ConstrObjet(10000, 700, 'background', bg2Img, 0, 0);

    var garde1 = initEnnemi(1600, 1000, 'garde', gardeImg, 1500);
    var garde2 = initEnnemi(1600, 1000, 'garde', gardeImg, 2500);
    var garde3 = initEnnemi(1600, 1000, 'garde', gardeImg, 3500);
    var garde4 = initEnnemi(1600, 1000, 'garde', gardeImg, 4500);
    var garde5 = initEnnemi(1600, 1000, 'garde', gardeImg, 5000);
    var garde6 = initEnnemi(1600, 1000, 'garde', gardeImg, 5500);
    var garde7 = initEnnemi(1600, 1000, 'garde', gardeImg, 5600);
    var garde8 = initEnnemi(1600, 1000, 'garde', gardeImg, 6400);
    var garde9 = initEnnemi(1600, 1000, 'garde', gardeImg, 6800);
    var garde10 = initEnnemi(1600, 1000, 'garde', gardeImg, 7200);
    var pinata = initEnnemi(1600, 1000, 'pinata', pinataImg, 7000);
    pinata.life = 100;
    pinata.vitesseEnnemi = 10;
    pinata.moveY = canvas.height - 350;


    var caisse1 = new ConstrObjetFixe(1600, 1000, 'caisse', caisseImg, 1000, 520, 3, 2);
    caisse1.palmares = 'html';
    var caisse2 = new ConstrObjetFixe(1600, 1000, 'caisse', caisseImg, 2000, 230, 3, 1);
    caisse2.palmares = 'css';
    var caisse3 = new ConstrObjetFixe(1600, 1000, 'caisse', caisseImg, 2700, 230, 2, 2);
    caisse3.palmares = 'js';
    var caisse4 = new ConstrObjetFixe(1600, 1000, 'caisse', caisseImg, 3850, 220, 0, 1);
    caisse4.palmares = 'jquery';
    var caisse5 = new ConstrObjetFixe(1600, 1000, 'caisse', caisseImg, 5110, 480, 0, 0);
    caisse5.palmares = 'angular';
    var caisse6 = new ConstrObjetFixe(1600, 1000, 'caisse', caisseImg, 6150, 520, 1, 0);
    caisse6.palmares = 'node';
    var caisse7 = new ConstrObjetFixe(1600, 1000, 'caisse', caisseImg, 6540, 200, 2, 0);
    caisse7.palmares = 'mongo';
    var caisse8 = new ConstrObjetFixe(1600, 1000, 'caisse', caisseImg, 6840, 390, 1, 1);
    caisse8.palmares = 'express';
    var caisse9 = new ConstrObjetFixe(1600, 1000, 'caisse', caisseImg, 6840, 500, 2, 1);
    caisse9.palmares = 'meteor';
    var caisse10 = new ConstrObjetFixe(1600, 1000, 'caisse', caisseImg, 7600, 520, 3, 0);
    caisse10.palmares = 'ps';
    var caisse11 = new ConstrObjetFixe(1600, 1000, 'caisse', caisseImg, 7800, 520, 0, 2);
    caisse11.palmares = 'ai';
    var caisse12 = new ConstrObjetFixe(1600, 1000, 'caisse', caisseImg, 7780, 430, 1, 2);
    caisse12.palmares = 'id';


    var tableauCaisse = [caisse1, caisse2, caisse3, caisse4, caisse5, caisse6, caisse7, caisse8, caisse9, caisse10, caisse11, caisse12];
    var rondinTableau = [];
    var gardesTableau = [garde1, garde2, garde3, garde4, garde5, garde6, garde7, garde8, garde9, garde10, pinata];

    var bigArray = [castor, caisse1, caisse2, caisse3, caisse4, caisse5, caisse6, caisse7, caisse8, caisse9, caisse10, caisse11, caisse12, garde1, garde2, garde3, garde4, garde5, garde6, garde7, garde8, garde9, garde10, pinata];

  /************** Utilisation claver *************/
 var appui = function(event){
  event.preventDefault();
  var code = event.code;

  switch (code){
  case 'ArrowLeft':
  if (castor.status === 'static' && castor.jump !== 'saut'){
      castor.status = 'gauche';
      castor.moveSpriteY = 1000;
    }
  if (castor.status === 'static' && castor.jump == 'saut'){
      castor.status = 'gauche-saut';
      castor.moveSpriteY = 1000;
    }
    break;
  case 'ArrowRight':
    if (castor.status === 'static' && castor.jump !== 'saut'){
        castor.status = 'droite';
        castor.moveSpriteY = 500;
      }
    if (castor.status === 'static' && castor.jump == 'saut'){
        castor.status = 'droite-saut';
        castor.moveSpriteY = 500;
      }
      break;
  case 'ArrowUp':
    if (castor.status !== 'droite' && castor.status !== 'gauche' && castor.jump !== 'saut'){
        castor.moveSpriteY = 0;
        castor.jump = 'saut';
        castor.vy = -18;
      }
    if (castor.status === 'droite' && castor.jump !== 'saut'){
        castor.status = 'droite-saut';
        castor.moveSpriteY = 500;
        castor.jump = 'saut';
        castor.vy = -15;
        }
    if (castor.status === 'gauche' && castor.jump !== 'saut'){
        castor.status = 'gauche-saut';
        castor.moveSpriteY = 1000;
        castor.jump = 'saut';
        castor.vy = -15;
        }
      break;
    case 'Enter':
      if (castor.status === 'static'){
          castor.status = 'tir';
          castor.moveSpriteY = 500;
          lancerSnd.play();
        setTimeout(function(){
          castor.moveSpriteY = 0;
          castor.status = 'static';
        },500);

        var rondin = new ConstrObjetMouvant(400,100, 'rondin', rondinImg, castor.moveX+80, castor.moveY+40);
        rondinTableau.push(rondin);
        bigArray.push(rondin);
      }
      break;
    }
  };

  var lachetouche = function(event){
    if(event.code == 'ArrowLeft' || event.code == 'ArrowRight'){
      castor.status = 'static';
      castor.moveSpriteY = 0;
    }
  };
    window.addEventListener('keydown', appui);

    //Keyup

    window.addEventListener('keyup', lachetouche);

    bg2Img.addEventListener('load', function(){
      game.animation(33);
});
  document.getElementById('launch').addEventListener('click', function(){
    document.getElementById('ecran').style.display = 'none';
  });

//});
