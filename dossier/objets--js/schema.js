/*
	Schema
	Cette classe corerspond au paramétrage du schéma réseau pour un exercice.
*/
var Schema = function Schema(id){
	this.id = id, // String
	this.nbrClients = 0, //int >= 0
	this.nbrServeurs = 0, // int >= 0
	this.nbrHubs = 0, // int >= 0
	this.nbrPortsHub = 0, // int >= 0
	this.nbrSwitches = 0, // int >= 0
	this.nbrPortsSwitch = 0, // int >= 0
	this.adressesMAC = new Array();
}
//pas de getters et setters
