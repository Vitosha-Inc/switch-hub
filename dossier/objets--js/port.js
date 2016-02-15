/*
	La classe Port
*/
var Port = function Port(id){
	this.id = id; // integer
	this.etat = "P"; // "T" (transmet)| "R" (reçoit) |"P" (passif)
	this.connexion = false; // false ou nom machine
}
/*
	Methodes
*/
//getters
Port.prototype.getId = function(){
	return this.id;
}
Port.prototype.getEtat = function(){
	return this.etat;
}
Port.prototype.getConnexion = function(){
	return this.connexion;
}

//setters
Port.prototype.setEtat = function(valeur){
	this.etat = valeur;
}
Port.prototype.connecter = function(unite){
	this.connexion = unite;
}
Port.prototype.deconnecter = function(){
	this.connexion = false;
}
//autres
//dire si le port est connecté à une machine donnée 
Port.prototype.estConnecte = function(machine){
	return this.connexion == machine;
}