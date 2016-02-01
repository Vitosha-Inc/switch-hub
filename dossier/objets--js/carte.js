/*
	Carte
*/
const ATOMX = 25;
const ATOMY = 25;
/*
	classe Position
*/
var Position = function Position(numero, x, y){
	this.numero = numero; // int >= 0 le numéro de la position
	this.x = x; // int > 0 coordonnée sur l'axe des x
	this.y = y; // int > 0 coordonnée sur l'axe des y
}
/*
	Methodes
*/
//getters
Position.prototype.getNiveau = function(){
	return this.niveau;
}
Position.prototype.getNumero = function(){
	return this.numero;
}
Position.prototype.getX = function(){
	return this.x;
}
Position.prototype.getY = function(){
	return this.y;
}
/*
	classe Niveau
*/
var Niveau = function Niveau(numero){
	this.numero = numero;
	this.positions = new Array();
}
/*
	Methodes
*/
//getters
Niveau.prototype.getNum = function(){
	return this.numero;
}
Niveau.prototype.getPositions = function(){
	return this.positions;
}
Niveau.prototype.getPosition = function(num){
	return this.positions[num];
}
//setters
Niveau.prototype.setPositions = function(nbr){
	var x = ATOMX,
		y = this.calculerY();
	
	for (var i = 0; i < nbr; i++){
		//set une position dans le tableau
		this.positions[i] = new Position(i, x, y);
		x += 4*ATOMX;
	}
}
//autres
Niveau.prototype.calculerY = function(){
	var y = ATOMY,
		numero = this.numero;
	while(numero > 0){
		y += 5*ATOMY;
		numero--;
	}
	return y;
}
/*
	classe Carte
*/
var Carte = function(nbrNiveaux, nbrPositions){
	this.nbrNiveaux = nbrNiveaux; // int >= 1
	this.niveaux = new Array(nbrNiveaux);
	for (var i=0; i < nbrNiveaux; i++){
		this.niveaux[i] = new Niveau(i);
		this.niveaux[i].setPositions(nbrPositions);
	}
}
/*
	Methodes
*/
Carte.prototype.getNbrNiveaux = function(){
	return this.nbrNiveaux;
}
Carte.prototype.getNiveaux = function(){
	return this.niveaux;
}
Carte.prototype.niveau = function(num){
	return this.niveaux[num];
}